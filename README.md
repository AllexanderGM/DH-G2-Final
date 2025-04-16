# Glocal Tours

This backend provides the necessary services to manage tour bookings, user authentication, filters, and CRUD functionalities.

## API Documentation (Swagger)

- [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## 🛠 Technologies Used

- Java 21
- Spring Boot 3.4.2
- Spring Security (JWT)
- Hibernate and JPA
- MySQL 3.8
- Maven

## 🌍 Available Endpoints

### 🔑 Authentication

- `POST /auth/register` – Register a new user
- `POST /auth/login` – Authenticate a user
- `POST /auth/refresh` – Refresh authentication token

### 🏞️ Tours

- `GET /tours/{id}` – Retrieve a tour by ID
- `PUT /tours/{id}` – Update a tour by ID
- `DELETE /tours/{id}` – Delete a tour by ID
- `PUT /tours/{id}/tags` – Update tags for a tour
- `GET /tours` – Retrieve all tours
- `POST /tours` – Create a new tour
- `GET /tours/random` – Retrieve a random tour
- `GET /tours/paginated` – Retrieve tours with pagination
- `GET /tours/filter/name` – Filter tours by name
- `GET /tours/filter/category` – Filter tours by category
- `GET /tours/filter/advanced` – Advanced tour filtering

### 📅 Bookings

- `GET /bookings` – Retrieve all bookings
- `POST /bookings` – Create a new booking
- `GET /bookings/{id}` – Retrieve a booking by ID
- `DELETE /bookings/{id}` – Delete a booking by ID
- `GET /bookings/tour/{tourId}` – Retrieve bookings for a specific tour
- `GET /bookings/historic` – Retrieve booking history

### 📆 Availabilities

- `GET /api/availabilities/tour/{tourId}` – Retrieve availabilities for a specific tour
- `POST /api/availabilities/tour/{tourId}` – Create availabilities for a specific tour
- `GET /api/availabilities` – Retrieve all availabilities