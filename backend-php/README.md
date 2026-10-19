# Murang'a County Government - Public Service Request System (PHP Backend Documentation)

Official documentation for deploying and running the **Murang'a County Public Service Request System** on standard PHP 8.x + MySQL / MariaDB (eCitizen Kenya architecture).

---

## 1. Architecture Overview

- **Server Language:** PHP 8.1+ (Object-Oriented with PDO)
- **Database:** MySQL 8.0+ or MariaDB 10.4+
- **Protocol:** RESTful JSON APIs
- **Design Pattern:** Singleton Database Connection, Parameterized Prepared Statements (Zero SQL Injection), CORS-ready headers.

---

## 2. Directory Structure

```
/backend-php/
├── config.php          # Database credentials, county constants, CORS
├── db.php              # Singleton PDO wrapper with error handling
├── schema.sql          # Full MySQL relational schema with seed records
├── auth.php            # Citizen registration, login, and Service Desk admin verification
├── requests.php        # Service requests CRUD, status updates, timeline audit logs
├── analytics.php       # Real-time SQL aggregations for county dashboard
└── README.md           # This setup and API reference
```

---

## 3. Database Installation

1. Import the schema file into your MySQL instance:
```bash
mysql -u root -p < /backend-php/schema.sql
```
Or use **phpMyAdmin** -> `Import` -> Select `schema.sql`.

2. Update credentials in `config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'muranga_public_services');
define('DB_USER', 'your_db_username');
define('DB_PASS', 'your_db_password');
```

---

## 4. API Reference

### A. Citizen Authentication
- **Register Citizen:**
  - `POST /backend-php/auth.php?action=register`
  - Body:
    ```json
    {
      "nationalId": "29837124",
      "fullName": "Kamau Njoroge",
      "email": "kamau@example.com",
      "phone": "+254 722 000 000",
      "subCounty": "Kiharu",
      "ward": "Murang'a Township",
      "password": "Password123"
    }
    ```
- **Login Citizen:**
  - `POST /backend-php/auth.php?action=login`
  - Body: `{"identifier": "29837124", "password": "Password123"}`

- **Service Desk Admin Login:**
  - `POST /backend-php/auth.php?action=admin-login`
  - Body: `{"email": "admin@muranga.go.ke", "password": "Muranga2026!"}`

### B. Service Requests
- **Create Request:**
  - `POST /backend-php/requests.php`
  - Returns auto-generated tracking code e.g. `MCG-2026-4819`
- **List & Filter Requests:**
  - `GET /backend-php/requests.php?status=Pending&subCounty=Kiharu&search=Hospital`
- **Track Single Ticket:**
  - `GET /backend-php/requests.php?tracking=MCG-2026-4819`
- **Update Request Status (Admin / Officer):**
  - `PATCH /backend-php/requests.php?tracking=MCG-2026-4819`
  - Body:
    ```json
    {
      "status": "In Progress",
      "assignedDepartment": "Infrastructure, Roads, Housing and Transport",
      "assignedOfficer": "Eng. Peter Gitau",
      "officerNote": "Work team dispatched with asphalt patch mix.",
      "actorName": "Dr. Newton Mwangi (Service Desk Admin)"
    }
    ```

### C. County Analytics
- `GET /backend-php/analytics.php`
- Returns total counts, open vs in-progress vs resolved, breakdown by category, and sub-county performance.

---

## 5. Security & Kenya Data Protection Compliance

- Passwords hashed using standard `PASSWORD_BCRYPT` (Cost 10).
- All queries utilize prepared statements (`PDO::prepare`) to prevent SQL injection.
- Citizen National IDs and phone numbers are indexed for quick lookup with minimum data exposure.
