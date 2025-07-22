# Event Management App - Backend

## Table of Contents
- [Project Description](#project-description)
- [Requirements](#requirements)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [REST API Endpoints](#rest-api-endpoints)
- [Sample Data](#sample-data)
- [Testing](#testing)
- [Authors](#authors)

---

## Project Description
Event Management App is an application for managing events, allowing user registration (participant/organizer), creating and editing events, booking seats, and viewing participants. The backend is built with Spring Boot, JPA/Hibernate, and MySQL.

The application uses **JSON Web Tokens (JWT)** for secure authentication and authorization. JWTs are issued upon successful login and are used to protect API endpoints, ensuring that only authenticated users with the appropriate roles can access specific resources.

## Requirements
- Java 17+
- Maven
- MySQL (or H2 for testing)
- Spring Boot

## Installation and Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-repo>/event-management-app.git
   cd event-management-app/backend
   ```
2. **Configure the database**
   - Edit `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/eventdb
     spring.datasource.username=youruser
     spring.datasource.password=yourpassword
     spring.jpa.hibernate.ddl-auto=update
     ```
3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
   or
   ```bash
   mvnw.cmd spring-boot:run
   ```

## Project Structure
```
backend/
├── src/main/java/com/example/backend/
│   ├── controller/        # REST Controllers
│   ├── model/             # JPA Entities
│   ├── repository/        # JPA Repositories
│   ├── service/           # Business Logic
│   └── config/            # Configurations (e.g., security)
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## REST API Endpoints
### Authentication
- `POST /api/auth/register` - user registration
- `POST /api/auth/login` - user login

### Users
- `GET /api/users/{id}` - get user profile by ID
- `GET /api/users` - list all users (organizer)
- `GET /api/users/role/{role}` - list users by role

### Events
- `GET /api/events` - list events (optional: filter by date/location)
- `GET /api/events/{id}` - event details
- `POST /api/events` - create an event (organizer)
- `PUT /api/events/{id}` - edit an event (organizer, owner)
- `DELETE /api/events/{id}` - delete an event (organizer, owner)
- `GET /api/events/{id}/participants` - list participants of an event (organizer, owner)

### Reservations
- `POST /api/reservations?eventId={id}` - book a seat (participant)
- `DELETE /api/reservations/{id}` - cancel a reservation (participant, owner)
- `GET /api/reservations/my` - list user's reservations (participant)
- `GET /api/reservations/event/{eventId}` - list reservations for an event (organizer, owner)

## Sample Data
### User
```json
{
  "email": "jan.kowalski@example.com",
  "password": "password123",
  "role": "PARTICIPANT"
}
```
### Event
```json
{
  "title": "IT Conference",
  "description": "IT industry meeting",
  "dateTime": "2025-08-01T10:00:00",
  "location": "Warsaw",
  "totalSeats": 100
}
```
### Reservation
```json
{
  "eventId": 1
}
```

## Testing
- Unit tests: `mvn test`
- Example test: `BackendApplicationTests.java`

## Additional Information
- TODO: Email notification system: to be implemented in the service (e.g., after registration/reservation)
- Data validation: JPA/Bean Validation annotations and validation in controllers
- Permissions: Spring Security, roles ORGANIZER/PARTICIPANT

---

> Frontend (React) is located in the `frontend/` directory.