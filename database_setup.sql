-- Emergency Medicine Finder Database Setup
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS emergency_medicine;
USE emergency_medicine;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    u_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    propic VARCHAR(255),
    house VARCHAR(100),
    road VARCHAR(100),
    division VARCHAR(100),
    zila VARCHAR(100),
    upazila VARCHAR(100),
    pass VARCHAR(255) NOT NULL,
    status TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Worker table
CREATE TABLE IF NOT EXISTS worker (
    w_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    shopname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    propic VARCHAR(255),
    nid1 VARCHAR(255),
    nid2 VARCHAR(255),
    house VARCHAR(100),
    road VARCHAR(100),
    division VARCHAR(100),
    zila VARCHAR(100),
    upazila VARCHAR(100),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    pass VARCHAR(255) NOT NULL,
    status TINYINT DEFAULT 0,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicine table (generic medicines)
CREATE TABLE IF NOT EXISTS medicine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    strength VARCHAR(100),
    generic VARCHAR(255),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shop medicine table (medicines available at specific shops)
CREATE TABLE IF NOT EXISTS shopmedicine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shop_email VARCHAR(255) NOT NULL,
    mediname VARCHAR(255) NOT NULL,
    meditype VARCHAR(100),
    medistrength VARCHAR(100),
    medigeneric VARCHAR(255),
    medicompany VARCHAR(255),
    stock INT DEFAULT 0,
    price DECIMAL(10, 2),
    FOREIGN KEY (shop_email) REFERENCES worker(email),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicine request table
CREATE TABLE IF NOT EXISTS medicine_request (
    req_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    medi_id INT NOT NULL,
    medi_name VARCHAR(255) NOT NULL,
    shop_email VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    ppic VARCHAR(255),
    status TINYINT DEFAULT 0 COMMENT '0: pending, 1: approved, 2: on hold',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email),
    FOREIGN KEY (shop_email) REFERENCES worker(email)
);

-- Organization service table
CREATE TABLE IF NOT EXISTS org_service (
    ser_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_uid VARCHAR(255) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some initial data for services
INSERT IGNORE INTO org_service (service_name, description) VALUES
('Medicine Delivery', 'Emergency medicine delivery service'),
('Medical Consultation', 'Online medical consultation'),
('Lab Test Collection', 'Home lab test sample collection'),
('Vaccination Service', 'Home vaccination service'),
('Medical Equipment Rental', 'Rental of medical equipment');

-- Create an admin user (password: admin123)
INSERT IGNORE INTO admin (admin_uid, pass) VALUES
('admin@emf.com', '$2b$10$8Y6X8v6v6v6v6v6v6v6v6u6v6v6v6v6v6v6v6v6v6v6v6v6v6v6');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_worker_email ON worker(email);
CREATE INDEX idx_medicine_request_user ON medicine_request(user_email);
CREATE INDEX idx_medicine_request_shop ON medicine_request(shop_email);
CREATE INDEX idx_shopmedicine_shop ON shopmedicine(shop_email);

-- Show created tables
SHOW TABLES;