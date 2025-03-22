package com.tours.domain.services;

import com.tours.domain.dto.booking.BookingRequestDTO;
import com.tours.domain.dto.booking.BookingResponseDTO;
import com.tours.exception.UnauthorizedException;
import com.tours.infrastructure.entities.booking.*;
import com.tours.infrastructure.entities.tour.Tour;
import com.tours.infrastructure.entities.user.User;
import com.tours.infrastructure.repositories.booking.IAccommodationRepository;
import com.tours.infrastructure.repositories.booking.IAvailabilityRepository;
import com.tours.infrastructure.repositories.booking.IBookingRepository;
import com.tours.infrastructure.repositories.booking.IPaymentMethodRepository;
import com.tours.infrastructure.repositories.tour.ITourRepository;
import com.tours.infrastructure.repositories.user.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final IBookingRepository bookingRepository;
    private final ITourRepository tourRepository;
    private final IUserRepository userRepository;
    private final IAccommodationRepository accommodationRepository;
    private final IPaymentMethodRepository paymentMethodRepository;
    private final IAvailabilityRepository availabilityRepository;

    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));
        Tour tour = tourRepository.findById(bookingRequestDTO.getTourId()).orElseThrow(() -> new UnauthorizedException("Tour no encontrado"));

        Accommodation accommodation = null;
        if (bookingRequestDTO.getAccommodationBooking() != null) {
            // Buscar si ya existe un Accommodation con ese tipo
            accommodation = accommodationRepository.findByAccommodationBooking(bookingRequestDTO.getAccommodationBooking()).orElse(null);
            // Si no existe, crearlo y guardarlo
            if (accommodation == null) {
                accommodation = new Accommodation(bookingRequestDTO.getAccommodationBooking());
                accommodation = accommodationRepository.save(accommodation);
            }
        }

        if (!checkAvailability(tour, bookingRequestDTO.getStartDate(), bookingRequestDTO.getEndDate(), bookingRequestDTO.getAdults(), bookingRequestDTO.getChildren())) {
            throw new UnauthorizedException("No hay disponibilidad para las fechas seleccionadas");
        }

        Double price = calculatePrice(tour, bookingRequestDTO.getAdults(), bookingRequestDTO.getChildren());

        Pay pay = null;
        if (bookingRequestDTO.getPaymentMethodId() != null) {
            pay = new Pay();
            PaymentMethod paymentMethod = paymentMethodRepository.findById(bookingRequestDTO.getPaymentMethodId()).orElseThrow(() -> new UnauthorizedException("Metodo de pago no encontrado"));
            pay.setPaymentMethod(paymentMethod);
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setStartDate(bookingRequestDTO.getStartDate());
        booking.setEndDate(bookingRequestDTO.getEndDate());
        booking.setAdults(bookingRequestDTO.getAdults());
        booking.setChildren(bookingRequestDTO.getChildren());
        booking.setAccommodation(accommodation);
        booking.setPrice(price);
        booking.setPay(pay);
        booking.setCreationDate(LocalDateTime.now());

        bookingRepository.save(booking);
        return new BookingResponseDTO(booking);
    }

    public BookingResponseDTO getBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new UnauthorizedException("Reserva no encontrada"));
        return new BookingResponseDTO(booking);
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(BookingResponseDTO::new).collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getBookingsByTour(Long tourId) {
        return bookingRepository.findByTourId(tourId).stream().map(BookingResponseDTO::new).collect(Collectors.toList());
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    private boolean checkAvailability(Tour tour, LocalDateTime startDate, LocalDateTime endDate, Integer adults, Integer children) {

        List<Booking> bookings = bookingRepository.findByTourId(tour.getId());
        for (Booking booking : bookings) {
            if (!(endDate.isBefore(booking.getStartDate()) || startDate.isAfter(booking.getEndDate()))) {
                return false;
            }
        }

        Availability availability = availabilityRepository.findByTourIdAndAvailableDate(tour.getId(), startDate);
        if (availability == null) {
            return false;
        }
        int totalRequested = adults + children;
        if (availability.getAvailableSlots() < totalRequested) {
            return false;
        }
        return true;
    }

    private Double calculatePrice(Tour tour, Integer adults, Integer children) {
        return tour.getAdultPrice().doubleValue() * adults + tour.getChildPrice().doubleValue() * children;
    }
}