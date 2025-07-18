# Event Management App - Backend

## Spis treści
- [Opis projektu](#opis-projektu)
- [Wymagania](#wymagania)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Struktura projektu](#struktura-projektu)
- [Endpointy REST API](#endpointy-rest-api)
- [Przykładowe dane](#przykładowe-dane)
- [Testowanie](#testowanie)
- [Autorzy](#autorzy)

---

## Opis projektu
Event Management App to aplikacja do zarządzania wydarzeniami, umożliwiająca rejestrację użytkowników (uczestnik/organizator), tworzenie i edycję wydarzeń, rezerwację miejsc oraz przeglądanie uczestników. Backend oparty jest o Spring Boot, JPA/Hibernate oraz MySQL.

## Wymagania
- Java 17+
- Maven
- MySQL (lub H2 do testów)
- Spring Boot

## Instalacja i uruchomienie
1. **Klonowanie repozytorium**
   ```bash
   git clone https://github.com/<twoje-repo>/event-management-app.git
   cd event-management-app/backend
   ```
2. **Konfiguracja bazy danych**
   - Edytuj `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/eventdb
     spring.datasource.username=youruser
     spring.datasource.password=yourpassword
     spring.jpa.hibernate.ddl-auto=update
     ```
3. **Uruchomienie aplikacji**
   ```bash
   ./mvnw spring-boot:run
   ```
   lub
   ```bash
   mvnw.cmd spring-boot:run
   ```

## Struktura projektu
```
backend/
├── src/main/java/com/example/backend/
│   ├── controller/        # Kontrolery REST
│   ├── model/             # Encje JPA
│   ├── repository/        # Repozytoria JPA
│   ├── service/           # Logika biznesowa
│   └── config/            # Konfiguracje (np. bezpieczeństwo)
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Endpointy REST API
### Autoryzacja
- `POST /api/auth/register` - rejestracja użytkownika
- `POST /api/auth/login` - logowanie

### Użytkownicy
- `GET /api/users/{id}` - pobierz profil użytkownika
- `GET /api/users` - lista wszystkich użytkowników (organizator)
- `GET /api/users/role/{role}` - lista użytkowników wg roli

### Wydarzenia
- `GET /api/events` - lista wydarzeń (opcjonalnie: filtr po dacie/lokalizacji)
- `GET /api/events/{id}` - szczegóły wydarzenia
- `POST /api/events` - utwórz wydarzenie (organizator)
- `PUT /api/events/{id}` - edytuj wydarzenie (organizator, właściciel)
- `DELETE /api/events/{id}` - usuń wydarzenie (organizator, właściciel)
- `GET /api/events/{id}/participants` - lista uczestników wydarzenia (organizator, właściciel)

### Rezerwacje
- `POST /api/reservations?eventId={id}` - rezerwacja miejsca (uczestnik)
- `DELETE /api/reservations/{id}` - anulowanie rezerwacji (uczestnik, właściciel)
- `GET /api/reservations/my` - lista własnych rezerwacji (uczestnik)
- `GET /api/reservations/event/{eventId}` - lista rezerwacji dla wydarzenia (organizator, właściciel)

## Przykładowe dane
### Użytkownik
```json
{
  "email": "jan.kowalski@example.com",
  "password": "haslo123",
  "role": "PARTICIPANT"
}
```
### Wydarzenie
```json
{
  "title": "Konferencja IT",
  "description": "Spotkanie branży IT",
  "dateTime": "2025-08-01T10:00:00",
  "location": "Warszawa",
  "totalSeats": 100
}
```
### Rezerwacja
```json
{
  "eventId": 1
}
```

## Testowanie
- Testy jednostkowe: `mvn test`
- Przykładowy test: `BackendApplicationTests.java`

## Dodatkowe informacje
- TODO: System powiadomień e-mail: do implementacji w serwisie (np. po rejestracji/rezerwacji)
- Walidacja danych: adnotacje JPA/Bean Validation oraz walidacja w kontrolerach
- Uprawnienia: Spring Security, role ORGANIZER/PARTICIPANT


---

> Frontend (React) znajduje się w katalogu `frontend/`.
