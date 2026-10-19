-- ====================================================================
-- Murang'a County Government (021) - Public Service Request System
-- Database Schema for MySQL 8.0+ / MariaDB 10.4+
-- ====================================================================

CREATE DATABASE IF NOT EXISTS muranga_public_services CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE muranga_public_services;

-- 1. Users Table (Citizens)
CREATE TABLE IF NOT EXISTS citizens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    national_id VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(120) NULL,
    phone VARCHAR(30) NOT NULL,
    sub_county VARCHAR(60) NOT NULL,
    ward VARCHAR(60) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_national_id (national_id),
    INDEX idx_sub_county (sub_county)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Administrators / County Officers Table
CREATE TABLE IF NOT EXISTS administrators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    badge_number VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    department VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Service Requests Table
CREATE TABLE IF NOT EXISTS service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(30) NOT NULL UNIQUE,
    citizen_id INT NULL,
    citizen_name VARCHAR(150) NOT NULL,
    citizen_phone VARCHAR(30) NOT NULL,
    citizen_email VARCHAR(120) NULL,
    national_id VARCHAR(20) NOT NULL,
    category ENUM(
        'Street Lighting',
        'Water & Sanitation',
        'Roads & Infrastructure',
        'Garbage & Environment',
        'Public Health',
        'Agriculture & Livestock',
        'Education & Bursary',
        'Other County Services'
    ) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sub_county VARCHAR(60) NOT NULL,
    ward VARCHAR(60) NOT NULL,
    landmark VARCHAR(150) NULL,
    priority ENUM('Standard', 'High', 'Urgent') DEFAULT 'Standard',
    status ENUM('Pending', 'In Progress', 'Resolved', 'Rejected') DEFAULT 'Pending',
    image_url LONGTEXT NULL,
    assigned_department VARCHAR(150) NULL,
    assigned_officer VARCHAR(150) NULL,
    resolution_notes TEXT NULL,
    resolved_at TIMESTAMP NULL,
    feedback_rating TINYINT NULL,
    feedback_comment TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizens(id) ON DELETE SET NULL,
    INDEX idx_tracking_number (tracking_number),
    INDEX idx_status (status),
    INDEX idx_sub_county (sub_county),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Status History & Audit Timeline Table
CREATE TABLE IF NOT EXISTS request_timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    actor_name VARCHAR(120) NOT NULL,
    actor_role ENUM('Citizen', 'System', 'Service Desk Admin', 'County Officer') DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
    INDEX idx_request_id (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Seed Data for Murang'a County
INSERT INTO administrators (badge_number, full_name, email, department, password_hash)
VALUES ('MCG-OPS-0084', 'Dr. Newton Mwangi', 'admin@muranga.go.ke', 'Public Service Delivery & Complaints Directorate', '$2y$10$wKkS1v9P8UeQJz...');

INSERT INTO citizens (national_id, full_name, email, phone, sub_county, ward, password_hash)
VALUES ('29837124', 'Kamau Njoroge Wainaina', 'kamau.njoroge@gmail.com', '+254 722 839 104', 'Kiharu', 'Murang\'a Township', '$2y$10$xyz...');

INSERT INTO service_requests (
    tracking_number, citizen_id, citizen_name, citizen_phone, national_id, category, title, description, sub_county, ward, landmark, priority, status
) VALUES (
    'MCG-2026-4819', 1, 'Kamau Njoroge Wainaina', '+254 722 839 104', '29837124', 'Street Lighting',
    'Defective Streetlight Cluster along Hospital Road',
    'Four consecutive streetlights flickering and completely shut down near Murang\'a Level 5 Hospital.',
    'Kiharu', 'Murang\'a Township', 'Near Murang\'a Level 5 Hospital Main Gate', 'High', 'In Progress'
);
