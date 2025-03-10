package com.tours.config;

import com.tours.domain.services.LocationService;
import com.tours.infrastructure.entities.location.Location;
import com.tours.infrastructure.entities.tour.*;
import com.tours.infrastructure.entities.user.Role;
import com.tours.infrastructure.entities.user.User;
import com.tours.infrastructure.entities.user.UserRol;
import com.tours.infrastructure.repositories.location.ILocationRepository;
import com.tours.infrastructure.repositories.tour.IHotelRepository;
import com.tours.infrastructure.repositories.tour.IIncludeRepository;
import com.tours.infrastructure.repositories.tour.IStatusTourRepository;
import com.tours.infrastructure.repositories.tour.ITagTourRepository;
import com.tours.infrastructure.repositories.user.IRoleUserRepository;
import com.tours.infrastructure.repositories.user.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private IRoleUserRepository roleRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IStatusTourRepository statusTourRepository;

    @Autowired
    private ITagTourRepository tagTourRepository;

    @Autowired
    private IIncludeRepository includeTourRepository;

    @Autowired
    private IHotelRepository hotelRepository;

    @Autowired
    private ILocationRepository locationRepository;

    @Autowired
    private LocationService locationService;


    public DataInitializer(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    @Override
    public void run(String... args) throws Exception {

        // Cargar ubicaciones antes que cualquier otra cosa
        locationService.loadDestinations();

        // Inicializar roles si no existen
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(UserRol.CLIENT));
            roleRepository.save(new Role(UserRol.ADMIN));
        }

        // Inicializar usuario administrador si no existe
        Role role = roleRepository.findByUserRol(UserRol.ADMIN)
                .orElseThrow(() -> new RuntimeException("No se encontró el rol de administrador"));

        if (!userRepository.existsByRole(role)) {
            User admin = User.builder()
                    .name("Admin")
                    .lastname("Admin")
                    .document("12345678")
                    .phone("123456789")
                    .dateOfBirth(LocalDate.of(2000, 1, 1))
                    .email("admin@admin.com")
                    .password(bCryptPasswordEncoder.encode("AdminPassword123"))
                    .dateOfJoin(LocalDate.now())
                    .address("Calle 123")
                    .city("departamento 1")
                    .role(role)
                    .build();

            userRepository.save(admin);
        }
        
        // Inicializar estados de tours si no existen
        if (statusTourRepository.count() == 0) {
            statusTourRepository.save(new StatusTour(StatusTourOptions.ACTIVE));
            statusTourRepository.save(new StatusTour(StatusTourOptions.INACTIVE));
            statusTourRepository.save(new StatusTour(StatusTourOptions.CANCELLED));
        }

        // Inicializar las etiquetas si no existen
        if (tagTourRepository.count() == 0) {
            tagTourRepository.save(new TagTour(TagTourOptions.VACATION));
            tagTourRepository.save(new TagTour(TagTourOptions.ECOTOURISM));
            tagTourRepository.save(new TagTour(TagTourOptions.LUXURY));
            tagTourRepository.save(new TagTour(TagTourOptions.ADVENTURE));
            tagTourRepository.save(new TagTour(TagTourOptions.ADRENALIN));
            tagTourRepository.save(new TagTour(TagTourOptions.BEACH));
            tagTourRepository.save(new TagTour(TagTourOptions.MOUNTAIN));
            tagTourRepository.save(new TagTour(TagTourOptions.CRUISE));
            tagTourRepository.save(new TagTour(TagTourOptions.CITY));
        }

        // Inicializar "incluye" si no existen
        if (includeTourRepository.count() == 0) {
            includeTourRepository.save(new IncludeTours(
                            "Ninguno",
                            "<span class=\\\"material-symbols-outlined\\\">radio_button_unchecked</span>",
                            "No incluye ningún servicio adicional"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Alojamiento",
                            "<span class=\\\"material-symbols-outlined\\\">hotel</span>",
                            "Hospedaje en hotel, hostal o cabaña"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Transporte",
                            "<span class=\\\"material-symbols-outlined\\\">directions_car</span>",
                            "Traslados terrestres, aéreos o marítimos"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Boletos",
                            "<span class=\\\"material-symbols-outlined\\\">airplane_ticket</span>",
                            "Entradas a parques, museos, eventos o shows"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Snacks",
                            "<span class=\\\"material-symbols-outlined\\\">tapas</span>",
                            "Refrigerios ligeros durante el tour"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Bebidas",
                            "<span class=\\\"material-symbols-outlined\\\">wine_bar</span>",
                            "Bebidas sin alcohol incluidas en la experiencia"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Desayuno",
                            "<span class=\\\"material-symbols-outlined\\\">egg_alt</span>",
                            "Primera comida del día incluida"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Almuerzo",
                            "<span class=\\\"material-symbols-outlined\\\">dinner_dining</span>",
                            "Comida principal del mediodía"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Cena",
                            "<span class=\\\"material-symbols-outlined\\\">restaurant</span>",
                            "Comida principal de la noche"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Guía turístico",
                            "<span class=\\\"material-symbols-outlined\\\">follow_the_signs</span>",
                            "Acompañamiento de un guía experto"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Seguro de viaje",
                            "<span class=\\\"material-symbols-outlined\\\">assignment_add</span>",
                            "Cobertura médica y asistencia durante el viaje"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Actividades",
                            "<span class=\\\"material-symbols-outlined\\\">theater_comedy</span>",
                            "Excursiones, deportes o experiencias guiadas"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Fotografías",
                            "<span class=\\\"material-symbols-outlined\\\">photo_camera</span>",
                            "Servicio de fotografía o video profesional"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Souvenirs",
                            "<span class=\\\"material-symbols-outlined\\\">page_info</span>",
                            "Regalos o recuerdos incluidos en el paquete"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Equipamiento",
                            "<span class=\\\"material-symbols-outlined\\\">personal_bag_question</span>",
                            "Ropa, accesorios o equipo necesario para la actividad"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Wifi",
                            "<span class=\\\"material-symbols-outlined\\\">wifi</span>",
                            "Conectividad a internet en el transporte o alojamiento"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Propinas",
                            "<span class=\\\"material-symbols-outlined\\\">payments</span>",
                            "Costos de propinas incluidos en el precio"
                    )
            );
            includeTourRepository.save(new IncludeTours(
                            "Asistencia 24/7",
                            "<span class=\\\"material-symbols-outlined\\\">ecg_heart</span>",
                            "Soporte y ayuda durante todo el viaje"
                    )
            );
        }

        if (hotelRepository.count() == 0) {
            List<Location> destinations = locationRepository.findAll();
            if (destinations.size() < 10) {
                throw new RuntimeException("No hay suficientes destinos en la base de datos");
            }

            Random random = new Random();
            int maxDestinations = destinations.size();

            hotelRepository.save(new HotelTour(null, "Grand Oasis Cancun", 5, destinations.get(random.nextInt(maxDestinations) + 1)));
            hotelRepository.save(new HotelTour(null, "Hotel Caribe", 4, destinations.get(random.nextInt(maxDestinations) + 1)));
            hotelRepository.save(new HotelTour(null, "Ritz Paris", 5, destinations.get(random.nextInt(maxDestinations) + 1)));
            hotelRepository.save(new HotelTour(null, "Hotel Hassler Roma", 5, destinations.get(random.nextInt(maxDestinations) + 1)));
            hotelRepository.save(new HotelTour(null, "Four Seasons Bali", 5, destinations.get(random.nextInt(maxDestinations) + 1)));
            hotelRepository.save(new HotelTour(null, "Plaza Hotel NYC", 5, destinations.get(random.nextInt(maxDestinations) + 1)));
            hotelRepository.save(new HotelTour(null, "Belmond Sanctuary", 5, destinations.get(random.nextInt(maxDestinations) + 1)));
            hotelRepository.save(new HotelTour(null, "Copacabana Palace", 5, destinations.get(random.nextInt(maxDestinations) + 1)));
            hotelRepository.save(new HotelTour(null, "Burj Al Arab", 7, destinations.get(random.nextInt(maxDestinations) + 1)));
            hotelRepository.save(new HotelTour(null, "W Barcelona", 5, destinations.get(random.nextInt(maxDestinations) + 1)));
        }
    }
}
