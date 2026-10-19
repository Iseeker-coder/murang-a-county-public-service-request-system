# Murang'a County Government - Public Service Request System (Mini eCitizen-style)

[![County Code](https://img.shields.io/badge/County-021%20Murang'a-007A3D.svg)](#)
[![National Architecture](https://img.shields.io/badge/Platform-eCitizen%20Kenya%20Standard-111827.svg)](#)
[![Stack](https://img.shields.io/badge/Backend-PHP%208.1%2B%20%7C%20Node%20Express-blue.svg)](#)

---

## 1. Project Overview & Features

### Citizen Portal (eCitizen-style Mini-System)
- **Citizen Registration & Login:** Full eCitizen-style flow using Kenyan National ID number, Full Name, Mobile Phone (`+254 7...`), Sub-County, and Ward selection.
- **Service Request Submission:** Submit public issue reports across 8 county categories (Street Lighting, Water & Sanitation, Roads & Culverts, Garbage & Dumpsites, Health Dispensaries, Agriculture Subsidies, Education Bursaries).
- **Murang'a Administrative Geography:** Full mapping of Murang'a's **7 Sub-Counties** (*Kiharu, Kangema, Mathioya, Gatanga, Kandara, Maragua, Kigumo*) and their respective 35 electoral wards.
- **Photo & Evidence Upload:** Optional photographic evidence upload with client preview.
- **Instant County Reference Generation:** Automatic sequential Kenyan tracking number generation (e.g., `MCG-2026-4819`).
- **Simulated SMS Notification:** Real-time SMS confirmation alert formatted for Safaricom/Airtel subscribers.

### Tracking & Public Transparency
- **Public Reference Search:** Citizens can input their tracking reference (`MCG-2026-XXXX`) without logging in to see real-time status.
- **3-Stage Lifecycle Tracker:** `Submitted / Pending` → `Assigned & In Progress` → `Resolved & Closed`.
- **Audit Timeline Log:** Every step is time-stamped with officer names, directorate dispatches, and action notes.
- **Printable County Acknowledgment Docket:** Official printable receipt formatted with Murang'a County coat of arms, barcode graphic, citizen particulars, and Kenya Access to Information Act legal notices.
- **Citizen Feedback & Satisfaction Rating (Bonus Feature):** Star rating (1 to 5) and feedback comments on resolved cases.

### Service Desk Admin Portal (Public Service Request Operations)
- **Administrative Authentication:** Secure officer portal (`admin@muranga.go.ke` or `requests.admin@muranga.go.ke` / `Muranga2026!`). Dedicated standalone operations desk separate from general human resource portals.
- **Operations Console:** Real-time KPI summaries (Total Logged, Pending Triage, In Progress, Resolved, % Resolution Rate).
- **Multi-Facet Filtering:** Instant search by keyword, filter by Directorate/Category, Sub-County, and Status.
- **Case Management & Dispatch Modal:** Assign tickets to specific county directorates and field officers (e.g. MUWASCO, Infrastructure Directorate), update status, and write official resolution reports.
- **CSV Data Export:** One-click download of all filtered records for County Executive Committee and Assembly reporting.

### Real-Time County Analytics
- Resolution rate counter and average turnaround calculation.
- Proportional bar charts of incident distribution by category.
- Sub-County geographic distribution breakdown.
- Prioritization index (Standard vs High vs Urgent).

---

## 2. PHP Backend Implementation (`/backend-php/`)

The application includes a complete, production-ready PHP 8.1+ PDO backend in `/backend-php/`:
- **`config.php`:** Database connection constants and CORS handler.
- **`db.php`:** Singleton PDO connection with parameterized prepared statements (SQL-injection immune).
- **`schema.sql`:** Complete MySQL relational schema with foreign keys, indexes, and Murang'a seed records.
- **`requests.php`:** RESTful endpoint handling `GET` (list & search), `POST` (create request with auto-generated tracking ID), and `PATCH` (status transition & audit trail).
- **`auth.php`:** Citizen registration, eCitizen verification, and service desk administrator authentication with `password_hash`.
- **`analytics.php`:** Real-time SQL aggregations for open vs. resolved cases and sub-county performance.

To run the PHP backend on Apache/Nginx or XAMPP:
```bash
# 1. Import MySQL Schema
mysql -u root -p < backend-php/schema.sql

# 2. Start PHP local development server (or point Apache DocumentRoot to directory)
php -S localhost:8000 -t backend-php/
```

---

## 3. Live Development Setup (AI Studio Node/Express Stack)

The interactive live application runs an Express REST API backend that mounts Vite dev middleware on port 3000:

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Express + Vite on port 3000)
npm run dev

# 3. Build for production
npm run build
npm run start
```
