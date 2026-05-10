-- Emergency Medicine Finder - Complete Database Setup with Sample Data
-- Run this script to set up the database and seed it with realistic sample data
-- Safe to run multiple times - always starts fresh

CREATE DATABASE IF NOT EXISTS emergency_medicine;
USE emergency_medicine;

-- Drop existing tables in reverse dependency order (clean slate)
DROP TABLE IF EXISTS daily_summary;
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS purchase_items;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS expense_categories;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS active_sessions;
DROP TABLE IF EXISTS stock_transfer;
DROP TABLE IF EXISTS medicine_request;
DROP TABLE IF EXISTS shopmedicine;
DROP TABLE IF EXISTS worker;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS medicine;
DROP TABLE IF EXISTS org_service;
DROP TABLE IF EXISTS admin;

-- ============================
-- TABLE STRUCTURES
-- ============================

-- Users/Patients table
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

-- Worker/Shopkeeper table
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

-- Master medicine catalog
CREATE TABLE IF NOT EXISTS medicine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    strength VARCHAR(100),
    generic VARCHAR(255),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shop-specific medicine inventory
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_email) REFERENCES worker(email) ON DELETE CASCADE
);

-- Medicine requests from users
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
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (shop_email) REFERENCES worker(email) ON DELETE CASCADE
);

-- Organization services
CREATE TABLE IF NOT EXISTS org_service (
    ser_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin accounts
CREATE TABLE IF NOT EXISTS admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_uid VARCHAR(255) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active sessions table for single-session-per-browser enforcement
CREATE TABLE IF NOT EXISTS active_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_role ENUM('user', 'shopkeeper', 'admin') NOT NULL,
    browser_key VARCHAR(255) NOT NULL,
    device_info VARCHAR(500),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email_role (user_email, user_role),
    INDEX idx_browser_key (browser_key),
    INDEX idx_expires (expires_at)
);

-- Stock transfer requests from admin to shops
CREATE TABLE IF NOT EXISTS stock_transfer (
    transfer_id INT AUTO_INCREMENT PRIMARY KEY,
    from_shop_email VARCHAR(255) NOT NULL,
    to_shop_email VARCHAR(255) NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    requested_by VARCHAR(255) NOT NULL COMMENT 'admin email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_shop_email) REFERENCES worker(email) ON DELETE CASCADE,
    FOREIGN KEY (to_shop_email) REFERENCES worker(email) ON DELETE CASCADE
);

-- ============================
-- PHARMACY MANAGEMENT TABLES
-- ============================

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_email) REFERENCES worker(email) ON DELETE CASCADE
);

-- Expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_email VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('utility', 'rent', 'salary', 'maintenance', 'marketing', 'other') NOT NULL DEFAULT 'other',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_email) REFERENCES worker(email) ON DELETE CASCADE,
    UNIQUE KEY unique_category (shop_email, name)
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_email VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method ENUM('cash', 'bank', 'mobile_banking') DEFAULT 'cash',
    reference_no VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_email) REFERENCES worker(email) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES expense_categories(category_id) ON DELETE RESTRICT
);

-- Purchases (Purchase Orders)
CREATE TABLE IF NOT EXISTS purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_email VARCHAR(255) NOT NULL,
    supplier_id INT,
    invoice_no VARCHAR(100) NOT NULL,
    purchase_date DATE NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    vat DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    due_amount DECIMAL(12, 2) DEFAULT 0,
    payment_status ENUM('paid', 'partial', 'due') DEFAULT 'due',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_email) REFERENCES worker(email) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL
);

-- Purchase Items
CREATE TABLE IF NOT EXISTS purchase_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    batch_no VARCHAR(100),
    expiry_date DATE,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    mrp DECIMAL(10, 2),
    total DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_id) REFERENCES purchases(purchase_id) ON DELETE CASCADE
);

-- Sales (Sales Transactions)
CREATE TABLE IF NOT EXISTS sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_email VARCHAR(255) NOT NULL,
    invoice_no VARCHAR(100) NOT NULL,
    sale_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    vat DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    due_amount DECIMAL(12, 2) DEFAULT 0,
    profit_amount DECIMAL(12, 2) DEFAULT 0,
    payment_method ENUM('cash', 'card', 'mobile_banking', 'credit') DEFAULT 'cash',
    sale_type ENUM('retail', 'wholesale', 'prescription') DEFAULT 'retail',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_email) REFERENCES worker(email) ON DELETE CASCADE
);

-- Sale Items
CREATE TABLE IF NOT EXISTS sale_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    batch_no VARCHAR(100),
    expiry_date DATE,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    mrp DECIMAL(10, 2),
    total DECIMAL(12, 2) NOT NULL,
    profit DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE
);

-- Daily Profit/Loss Summary
CREATE TABLE IF NOT EXISTS daily_summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_email VARCHAR(255) NOT NULL,
    summary_date DATE NOT NULL,
    total_purchase DECIMAL(12, 2) DEFAULT 0,
    total_sales DECIMAL(12, 2) DEFAULT 0,
    total_expense DECIMAL(12, 2) DEFAULT 0,
    total_profit DECIMAL(12, 2) DEFAULT 0,
    cash_in_hand DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_email) REFERENCES worker(email) ON DELETE CASCADE,
    UNIQUE KEY unique_date_shop (shop_email, summary_date)
);

-- ============================
-- SAMPLE DATA
-- ============================

-- Admin account (password: admin123)
-- Hash generated by bcryptjs with 10 rounds
INSERT IGNORE INTO admin (admin_uid, pass) VALUES
('admin@emf.com', '$2a$10$RhFx78qMA8Fa2IXyukD4oeUwOUCDq7y551/m0bPJqvf8OWPXCJ0m6');

-- Organization services
INSERT IGNORE INTO org_service (service_name, description) VALUES
('Medicine Delivery', 'Emergency medicine delivery service within 30 minutes'),
('Medical Consultation', 'Online medical consultation with licensed physicians'),
('Lab Test Collection', 'Home lab test sample collection service'),
('Vaccination Service', 'Home vaccination service for all age groups'),
('Medical Equipment Rental', 'Rental of medical equipment like oxygen cylinders, wheelchairs');

-- Master Medicine Catalog (50 common Bangladeshi medicines)
INSERT IGNORE INTO medicine (name, type, strength, generic, company) VALUES
('Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco Pharmaceuticals'),
('Napa Extra', 'Tablet', '500mg + 65mg', 'Paracetamol + Caffeine', 'Beximco Pharmaceuticals'),
('Ace Plus', 'Tablet', '500mg + 65mg', 'Paracetamol + Caffeine', 'Square Pharmaceuticals'),
('Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Square Pharmaceuticals'),
('Tufnil', 'Tablet', '10mg', 'Cetirizine', 'Incepta Pharmaceuticals'),
('Monirol', 'Sachet', '5.6g', 'Methylin', 'Square Pharmaceuticals'),
('Seclo', 'Capsule', '20mg', 'Omeprazole', 'Healthcare Pharmaceuticals'),
('Maxpro', 'Tablet', '40mg', 'Pantoprazole', 'Square Pharmaceuticals'),
('Flagyl', 'Tablet', '400mg', 'Metronidazole', 'ACI Limited'),
('Ciprocin', 'Tablet', '500mg', 'Ciprofloxacin', 'Square Pharmaceuticals'),
('Azithro', 'Tablet', '500mg', 'Azithromycin', 'Square Pharmaceuticals'),
('Cef-3', 'Capsule', '250mg', 'Cefixime', 'Incepta Pharmaceuticals'),
('Moxacil', 'Capsule', '500mg', 'Amoxicillin', 'Beximco Pharmaceuticals'),
('Clavox', 'Tablet', '625mg', 'Amoxicillin + Clavulanic Acid', 'Square Pharmaceuticals'),
('Rancept', 'Tablet', '40mg', 'Rosuvastatin', 'Square Pharmaceuticals'),
('Cardivas', 'Tablet', '6.25mg', 'Carvedilol', 'Square Pharmaceuticals'),
('Angilock', 'Tablet', '50mg', 'Losartan', 'Square Pharmaceuticals'),
('Nebicard', 'Tablet', '5mg', 'Nebivolol', 'Square Pharmaceuticals'),
('Insulatard', 'Injection', '100IU/ml', 'Human Insulin', 'Novo Nordisk'),
('Metformin', 'Tablet', '500mg', 'Metformin', 'Square Pharmaceuticals'),
('Euglucon', 'Tablet', '5mg', 'Glibenclamide', 'ACI Limited'),
('Glipizide', 'Tablet', '5mg', 'Glipizide', 'Beximco Pharmaceuticals'),
('Diapride', 'Tablet', '50mg', 'Vildagliptin', 'Square Pharmaceuticals'),
('Piozon', 'Tablet', '15mg', 'Pioglitazone', 'Square Pharmaceuticals'),
('Alatrol', 'Tablet', '10mg', 'Loratadine', 'Incepta Pharmaceuticals'),
('Histacin', 'Tablet', '10mg', 'Cetirizine', 'Square Pharmaceuticals'),
('Zantic', 'Tablet', '150mg', 'Ranitidine', 'Beximco Pharmaceuticals'),
('Maxpro XL', 'Tablet', '40mg', 'Pantoprazole', 'Square Pharmaceuticals'),
('Domperon', 'Tablet', '10mg', 'Domperidone', 'Incepta Pharmaceuticals'),
('Buscopan', 'Tablet', '10mg', 'Hyoscine Butylbromide', 'ACI Limited'),
('Diclofenac', 'Gel', '1%', 'Diclofenac', 'Square Pharmaceuticals'),
('Voltarol', 'Tablet', '50mg', 'Diclofenac', 'ACI Limited'),
('Ibuprofen', 'Tablet', '400mg', 'Ibuprofen', 'Beximco Pharmaceuticals'),
('Naproxen', 'Tablet', '500mg', 'Naproxen', 'Renata Limited'),
('Maxicet', 'Tablet', '500mg', 'Paracetamol', 'ACI Limited'),
('Oradol', 'Lozenges', '2mg', 'Amylmetacresol', 'Square Pharmaceuticals'),
('Strepsils', 'Lozenges', '1.2mg', 'Dichlorobenzyl Alcohol', 'Reckitt Benckiser'),
('Salbutamol', 'Inhaler', '100mcg', 'Salbutamol', 'Beximco Pharmaceuticals'),
('Budesonide', 'Inhaler', '200mcg', 'Budesonide', 'Square Pharmaceuticals'),
('Montair', 'Tablet', '10mg', 'Montelukast', 'Square Pharmaceuticals'),
('Prednisolone', 'Tablet', '5mg', 'Prednisolone', 'ACI Limited'),
('Dexamethasone', 'Tablet', '0.5mg', 'Dexamethasone', 'Square Pharmaceuticals'),
('Thyrox', 'Tablet', '50mcg', 'Levothyroxine', 'Beximco Pharmaceuticals'),
('Carbagyl', 'Tablet', '200mg', 'Carbamazepine', 'Incepta Pharmaceuticals'),
('Phenobarb', 'Tablet', '30mg', 'Phenobarbital', 'ACI Limited'),
('Diazepam', 'Tablet', '5mg', 'Diazepam', 'Square Pharmaceuticals'),
('Oradexon', 'Tablet', '0.5mg', 'Dexamethasone', 'Renata Limited'),
('Doxacin', 'Capsule', '100mg', 'Doxycycline', 'Square Pharmaceuticals'),
('Claricin', 'Tablet', '500mg', 'Clarithromycin', 'Beximco Pharmaceuticals'),
('Sporilin', 'Capsule', '100mg', 'Itraconazole', 'Square Pharmaceuticals');

-- Sample Users (3 users, all active with status=1)
-- Passwords are bcrypt hashes of "user123"
INSERT IGNORE INTO users (first_name, last_name, gender, email, phone, propic, house, road, division, zila, upazila, pass, status) VALUES
('Rahim', 'Miah', 'Male', 'rahim@email.com', '01711111111', 'default-user.png', '12/A', 'Road 5', 'Dhaka', 'Dhaka', 'Mirpur', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1),
('Fatima', 'Begum', 'Female', 'fatima@email.com', '01722222222', 'default-user.png', '45', 'Road 12', 'Chattogram', 'Chattogram', 'Halishahar', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1),
('Karim', 'Hossain', 'Male', 'karim@email.com', '01733333333', 'default-user.png', '78', 'Road 3', 'Dhaka', 'Gazipur', 'Tongi', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1);

-- Sample Workers/Shopkeepers (3 shops, all active with status=1)
-- Passwords are bcrypt hashes of "worker123"
INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
('Abdul', 'Haque', 'Male', 'Haques Pharmacy', 'haque@pharmacy.com', '01811111111', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', '23', 'Road 8', 'Dhaka', 'Dhaka', 'Mirpur-12', '23.8223', '90.3669', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shahida', 'Akter', 'Female', 'Shahida Medical Store', 'shahida@medical.com', '01822222222', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', '56', 'Road 15', 'Chattogram', 'Chattogram', 'Agrabad', '22.3192', '91.8041', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Jahangir', 'Alam', 'Male', 'Alam Brothers Pharma', 'alam@pharma.com', '01833333333', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', '12', 'Road 4', 'Dhaka', 'Dhaka', 'Uttara', '23.8763', '90.3796', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================
-- PHARMACY MANAGEMENT SAMPLE DATA
-- ============================

-- Sample Suppliers
INSERT IGNORE INTO suppliers (shop_email, name, company, email, phone, address, city) VALUES
('haque@pharmacy.com', 'Mofiz Uddin', 'Square Pharmaceuticals Ltd.', 'mofiz@squarepharma.com', '01711110001', '48, Motijheel C/A', 'Dhaka'),
('haque@pharmacy.com', 'Karim Ullah', 'Beximco Pharmaceuticals Ltd.', 'karim@beximco.com', '01711110002', '19, Dhanmondi, Road 2', 'Dhaka'),
('haque@pharmacy.com', 'Shamim Reza', 'Incepta Pharmaceuticals Ltd.', 'shamim@incepta.com', '01711110003', '40, Shahid Tajuddin Ahmed Sarani', 'Dhaka'),
('haque@pharmacy.com', 'Nurul Islam', 'Healthcare Pharmaceuticals Ltd.', 'nurul@healthcare.com', '01711110004', '38, Monipuri Para, Mirpur', 'Dhaka'),
('shahida@medical.com', 'Rafiq Hasan', 'ACI Limited', 'rafiq@aci-bd.com', '01722220001', '245, Tejgaon I/A', 'Dhaka'),
('shahida@medical.com', 'Jamil Hossain', 'Renata Limited', 'jamil@renata.com', '01722220002', '72, Mohakhali C/A', 'Dhaka'),
('shahida@medical.com', 'Nazmul Haque', 'Aristopharma Ltd.', 'nazmul@aristopharma.com', '01722220003', '7, Purana Paltan', 'Dhaka'),
('alam@pharma.com', 'Abul Kashem', 'Square Pharmaceuticals Ltd.', 'kashem@squarepharma.com', '01733330001', '48, Motijheel C/A', 'Dhaka'),
('alam@pharma.com', 'Mizanur Rahman', 'Opsonin Pharma Ltd.', 'mizan@opsonin.com', '01733330002', '39, New Eskaton Road', 'Dhaka'),
('alam@pharma.com', 'Shahin Alam', 'Beacon Pharmaceuticals PLC', 'shahin@beacon.com', '01733330003', '9/A, Pragati Sarani, Kuril', 'Dhaka');

-- Sample Expense Categories
INSERT IGNORE INTO expense_categories (shop_email, name, type) VALUES
('haque@pharmacy.com', 'Shop Rent', 'rent'),
('haque@pharmacy.com', 'Electricity Bill', 'utility'),
('haque@pharmacy.com', 'Water Bill', 'utility'),
('haque@pharmacy.com', 'Employee Salary', 'salary'),
('haque@pharmacy.com', 'Shop Maintenance', 'maintenance'),
('haque@pharmacy.com', 'Marketing & Promotion', 'marketing'),
('haque@pharmacy.com', 'Other Costs', 'other'),
('shahida@medical.com', 'Shop Rent', 'rent'),
('shahida@medical.com', 'Electricity Bill', 'utility'),
('shahida@medical.com', 'Employee Salary', 'salary'),
('shahida@medical.com', 'Internet & Phone', 'utility'),
('shahida@medical.com', 'Shop Maintenance', 'maintenance'),
('alam@pharma.com', 'Shop Rent', 'rent'),
('alam@pharma.com', 'Electricity Bill', 'utility'),
('alam@pharma.com', 'Employee Salary', 'salary'),
('alam@pharma.com', 'Security Service', 'other'),
('alam@pharma.com', 'Marketing & Promotion', 'marketing');

-- Sample Expenses
INSERT IGNORE INTO expenses (shop_email, category_id, description, amount, expense_date, payment_method) VALUES
-- Haque's Pharmacy - this month expenses
('haque@pharmacy.com', 1, 'Monthly rent for March 2026', 25000.00, '2026-03-01', 'bank'),
('haque@pharmacy.com', 2, 'Electricity bill March 2026', 4500.00, '2026-03-05', 'mobile_banking'),
('haque@pharmacy.com', 4, 'Staff salary - Abdul (assistant)', 12000.00, '2026-03-01', 'cash'),
('haque@pharmacy.com', 4, 'Staff salary - Karim (delivery)', 8000.00, '2026-03-01', 'cash'),
('haque@pharmacy.com', 5, 'AC service and repair', 3500.00, '2026-03-10', 'cash'),
('haque@pharmacy.com', 6, 'Facebook promotion campaign', 2000.00, '2026-03-15', 'mobile_banking'),
('haque@pharmacy.com', 3, 'Water bill March 2026', 800.00, '2026-03-05', 'cash'),
-- Shahida Medical Store
('shahida@medical.com', 1, 'Monthly rent for March 2026', 18000.00, '2026-03-01', 'bank'),
('shahida@medical.com', 2, 'Electricity bill March 2026', 3800.00, '2026-03-06', 'mobile_banking'),
('shahida@medical.com', 3, 'Staff salary - Fatima (assistant)', 10000.00, '2026-03-01', 'cash'),
('shahida@medical.com', 4, 'Internet and phone bill', 1500.00, '2026-03-08', 'mobile_banking'),
('shahida@medical.com', 5, 'Furniture repair', 2200.00, '2026-03-12', 'cash'),
-- Alam Brothers Pharma
('alam@pharma.com', 1, 'Monthly rent for March 2026', 35000.00, '2026-03-01', 'bank'),
('alam@pharma.com', 2, 'Electricity bill March 2026', 5200.00, '2026-03-05', 'mobile_banking'),
('alam@pharma.com', 3, 'Staff salary - Rahim (pharmacist)', 15000.00, '2026-03-01', 'cash'),
('alam@pharma.com', 3, 'Staff salary - Sumon (helper)', 9000.00, '2026-03-01', 'cash'),
('alam@pharma.com', 4, 'Security guard service fee', 6000.00, '2026-03-01', 'cash'),
('alam@pharma.com', 5, 'Leaflet printing and distribution', 3000.00, '2026-03-10', 'cash');

-- Sample Purchases
INSERT IGNORE INTO purchases (shop_email, supplier_id, invoice_no, purchase_date, subtotal, discount, vat, total_amount, paid_amount, due_amount, payment_status) VALUES
-- Haque's Pharmacy purchases
('haque@pharmacy.com', 1, 'PUR-2026-03-001', '2026-03-02', 45000.00, 1000.00, 0.00, 44000.00, 44000.00, 0.00, 'paid'),
('haque@pharmacy.com', 2, 'PUR-2026-03-002', '2026-03-05', 28000.00, 500.00, 0.00, 27500.00, 20000.00, 7500.00, 'partial'),
('haque@pharmacy.com', 3, 'PUR-2026-03-003', '2026-03-10', 35000.00, 0.00, 0.00, 35000.00, 35000.00, 0.00, 'paid'),
-- Shahida Medical Store purchases
('shahida@medical.com', 5, 'PUR-2026-03-001', '2026-03-03', 32000.00, 800.00, 0.00, 31200.00, 31200.00, 0.00, 'paid'),
('shahida@medical.com', 6, 'PUR-2026-03-002', '2026-03-08', 22000.00, 0.00, 0.00, 22000.00, 15000.00, 7000.00, 'partial'),
-- Alam Brothers Pharma purchases
('alam@pharma.com', 8, 'PUR-2026-03-001', '2026-03-02', 55000.00, 1500.00, 0.00, 53500.00, 53500.00, 0.00, 'paid'),
('alam@pharma.com', 9, 'PUR-2026-03-002', '2026-03-07', 18000.00, 0.00, 0.00, 18000.00, 18000.00, 0.00, 'paid'),
('alam@pharma.com', 10, 'PUR-2026-03-003', '2026-03-12', 42000.00, 1000.00, 0.00, 41000.00, 30000.00, 11000.00, 'partial');

-- Sample Purchase Items
INSERT IGNORE INTO purchase_items (purchase_id, medicine_name, batch_no, expiry_date, quantity, unit_price, mrp, total) VALUES
-- Haque's Pharmacy purchase items
(1, 'Napa', 'BXP-NP-03/26', '2027-03-01', 500, 3.50, 5.00, 1750.00),
(1, 'Ace Plus', 'SQR-AP-03/26', '2027-02-01', 300, 4.00, 6.00, 1200.00),
(1, 'Seclo', 'HCP-SL-03/26', '2027-01-01', 400, 5.50, 8.00, 2200.00),
(1, 'Fexo', 'SQR-FX-03/26', '2026-12-01', 250, 4.00, 6.00, 1000.00),
(1, 'Flagyl', 'ACI-FL-03/26', '2027-03-01', 350, 2.50, 4.00, 875.00),
(1, 'Azithro', 'SQR-AZ-03/26', '2026-11-01', 200, 10.00, 15.00, 2000.00),
(1, 'Maxpro', 'SQR-MP-03/26', '2026-10-01', 300, 6.50, 10.00, 1950.00),
(1, 'Ciprocin', 'SQR-CP-03/26', '2027-02-01', 250, 5.00, 8.00, 1250.00),
(2, 'Moxacil', 'BXP-MX-03/26', '2026-11-01', 400, 4.50, 7.00, 1800.00),
(2, 'Clavox', 'SQR-CV-03/26', '2026-12-01', 150, 18.00, 25.00, 2700.00),
(3, 'Metformin', 'SQR-MF-03/26', '2027-04-01', 500, 2.00, 3.00, 1000.00),
(3, 'Montair', 'SQR-MT-03/26', '2027-03-01', 200, 5.00, 8.00, 1000.00),
(3, 'Dexamethasone', 'SQR-DX-03/26', '2027-02-01', 300, 1.50, 2.50, 450.00),
-- Shahida Medical Store purchase items
(4, 'Napa', 'BXP-NP-03/26-B', '2027-03-01', 600, 3.00, 4.00, 1800.00),
(4, 'Zantic', 'BXP-ZT-03/26', '2026-12-01', 200, 3.50, 5.00, 700.00),
(4, 'Alatrol', 'INP-AL-03/26', '2026-10-01', 150, 2.00, 3.00, 300.00),
(4, 'Ibuprofen', 'BXP-IB-03/26', '2027-01-01', 300, 4.00, 6.00, 1200.00),
(5, 'Cef-3', 'INP-CF-03/26', '2026-11-01', 100, 14.00, 20.00, 1400.00),
(5, 'Buscopan', 'ACI-BS-03/26', '2027-03-01', 150, 2.50, 4.00, 375.00),
-- Alam Brothers Pharma purchase items
(6, 'Napa', 'BXP-NP-03/26-C', '2027-03-01', 800, 3.50, 5.00, 2800.00),
(6, 'Clavox', 'SQR-CV-03/26-B', '2026-12-01', 200, 18.00, 25.00, 3600.00),
(6, 'Rancept', 'SQR-RC-03/26', '2026-11-01', 250, 8.00, 12.00, 2000.00),
(6, 'Salbutamol', 'BXP-SB-03/26', '2027-04-01', 100, 100.00, 150.00, 10000.00),
(7, 'Nebicard', 'SQR-NB-03/26', '2026-10-01', 150, 6.50, 10.00, 975.00),
(7, 'Doxacin', 'SQR-DX-03/26-B', '2027-01-01', 200, 4.00, 6.00, 800.00),
(8, 'Claricin', 'BXP-CL-03/26', '2027-02-01', 180, 12.00, 18.00, 2160.00),
(8, 'Cardivas', 'SQR-CD-03/26', '2026-12-01', 120, 8.00, 12.00, 960.00);

-- Sample Sales
INSERT IGNORE INTO sales (shop_email, invoice_no, sale_date, customer_name, customer_phone, subtotal, discount, total_amount, paid_amount, profit_amount, payment_method, sale_type) VALUES
-- Haque's Pharmacy sales
('haque@pharmacy.com', 'INV-2026-03-001', '2026-03-03 10:30:00', 'Md. Rafiq Islam', '01712345678', 125.00, 0.00, 125.00, 125.00, 35.00, 'cash', 'retail'),
('haque@pharmacy.com', 'INV-2026-03-002', '2026-03-03 11:15:00', 'Shamima Akter', '01798765432', 230.00, 10.00, 220.00, 220.00, 65.00, 'cash', 'retail'),
('haque@pharmacy.com', 'INV-2026-03-003', '2026-03-04 09:45:00', 'Md. Kamal Hossain', '01811112222', 450.00, 0.00, 450.00, 450.00, 150.00, 'mobile_banking', 'prescription'),
('haque@pharmacy.com', 'INV-2026-03-004', '2026-03-04 14:00:00', 'Rina Begum', '01722223333', 320.00, 0.00, 320.00, 320.00, 95.00, 'cash', 'retail'),
('haque@pharmacy.com', 'INV-2026-03-005', '2026-03-05 10:00:00', 'Md. Shahidullah', '01633334444', 680.00, 20.00, 660.00, 660.00, 200.00, 'card', 'wholesale'),
('haque@pharmacy.com', 'INV-2026-03-006', '2026-03-05 16:30:00', 'Taslima Khatun', '01744445555', 175.00, 0.00, 175.00, 175.00, 55.00, 'cash', 'retail'),
-- Shahida Medical Store sales
('shahida@medical.com', 'INV-2026-03-001', '2026-03-03 10:00:00', 'Md. Jashim Uddin', '01555556666', 310.00, 0.00, 310.00, 310.00, 90.00, 'cash', 'retail'),
('shahida@medical.com', 'INV-2026-03-002', '2026-03-04 11:30:00', 'Nasrin Sultana', '01766667777', 520.00, 15.00, 505.00, 505.00, 160.00, 'mobile_banking', 'prescription'),
('shahida@medical.com', 'INV-2026-03-003', '2026-03-05 09:15:00', 'Md. Abul Kalam', '01877778888', 225.00, 0.00, 225.00, 225.00, 70.00, 'cash', 'retail'),
('shahida@medical.com', 'INV-2026-03-004', '2026-03-05 15:00:00', 'Saleha Begum', '01788889999', 890.00, 25.00, 865.00, 865.00, 280.00, 'card', 'wholesale'),
-- Alam Brothers Pharma sales
('alam@pharma.com', 'INV-2026-03-001', '2026-03-03 10:30:00', 'Md. Ismail Hossain', '01999990001', 750.00, 0.00, 750.00, 750.00, 220.00, 'cash', 'prescription'),
('alam@pharma.com', 'INV-2026-03-002', '2026-03-04 12:00:00', 'Shahinur Akter', '01888881111', 1250.00, 50.00, 1200.00, 1200.00, 380.00, 'mobile_banking', 'prescription'),
('alam@pharma.com', 'INV-2026-03-003', '2026-03-05 11:00:00', 'Md. Nurul Amin', '01711112222', 180.00, 0.00, 180.00, 180.00, 50.00, 'cash', 'retail'),
('alam@pharma.com', 'INV-2026-03-004', '2026-03-05 17:30:00', 'Hasina Begum', '01622223333', 430.00, 0.00, 430.00, 430.00, 130.00, 'cash', 'retail'),
('alam@pharma.com', 'INV-2026-03-005', '2026-03-06 09:00:00', 'Md. Taher Ali', '01533334444', 2100.00, 100.00, 2000.00, 2000.00, 650.00, 'cash', 'wholesale'),
('alam@pharma.com', 'INV-2026-03-006', '2026-03-06 14:00:00', 'Farida Yasmin', '01744445555', 345.00, 0.00, 345.00, 345.00, 100.00, 'mobile_banking', 'retail');

-- Sample Sale Items
INSERT IGNORE INTO sale_items (sale_id, medicine_name, batch_no, quantity, unit_price, cost_price, mrp, total, profit) VALUES
-- Haque's Pharmacy sale items
(1, 'Napa', 'BXP-NP-03/26', 10, 5.00, 3.50, 5.00, 50.00, 15.00),
(1, 'Seclo', 'HCP-SL-03/26', 5, 8.00, 5.50, 8.00, 40.00, 12.50),
(1, 'Fexo', 'SQR-FX-03/26', 3, 6.00, 4.00, 6.00, 18.00, 6.00),
(2, 'Flagyl', 'ACI-FL-03/26', 8, 4.00, 2.50, 4.00, 32.00, 12.00),
(2, 'Azithro', 'SQR-AZ-03/26', 2, 15.00, 10.00, 15.00, 30.00, 10.00),
(3, 'Maxpro', 'SQR-MP-03/26', 15, 10.00, 6.50, 10.00, 150.00, 52.50),
(3, 'Moxacil', 'BXP-MX-03/26', 10, 7.00, 4.50, 7.00, 70.00, 25.00),
(4, 'Ciprocin', 'SQR-CP-03/26', 5, 8.00, 5.00, 8.00, 40.00, 15.00),
(5, 'Clavox', 'SQR-CV-03/26', 10, 25.00, 18.00, 25.00, 250.00, 70.00),
(6, 'Metformin', 'SQR-MF-03/26', 12, 3.00, 2.00, 3.00, 36.00, 12.00),
-- Shahida Medical Store sale items
(7, 'Napa', 'BXP-NP-03/26-B', 15, 4.00, 3.00, 4.00, 60.00, 15.00),
(7, 'Alatrol', 'INP-AL-03/26', 5, 3.00, 2.00, 3.00, 15.00, 5.00),
(8, 'Ibuprofen', 'BXP-IB-03/26', 10, 6.00, 4.00, 6.00, 60.00, 20.00),
(8, 'Cef-3', 'INP-CF-03/26', 3, 20.00, 14.00, 20.00, 60.00, 18.00),
(9, 'Zantic', 'BXP-ZT-03/26', 6, 5.00, 3.50, 5.00, 30.00, 9.00),
(10, 'Buscopan', 'ACI-BS-03/26', 20, 4.00, 2.50, 4.00, 80.00, 30.00),
-- Alam Brothers Pharma sale items
(11, 'Clavox', 'SQR-CV-03/26-B', 5, 25.00, 18.00, 25.00, 125.00, 35.00),
(11, 'Rancept', 'SQR-RC-03/26', 10, 12.00, 8.00, 12.00, 120.00, 40.00),
(11, 'Montair', 'SQR-MT-03/26', 3, 8.00, 5.00, 8.00, 24.00, 9.00),
(12, 'Salbutamol', 'BXP-SB-03/26', 2, 150.00, 100.00, 150.00, 300.00, 100.00),
(12, 'Nebicard', 'SQR-NB-03/26', 5, 10.00, 6.50, 10.00, 50.00, 17.50),
(13, 'Doxacin', 'SQR-DX-03/26-B', 3, 6.00, 4.00, 6.00, 18.00, 6.00),
(14, 'Claricin', 'BXP-CL-03/26', 4, 18.00, 12.00, 18.00, 72.00, 24.00),
(15, 'Cardivas', 'SQR-CD-03/26', 10, 12.00, 8.00, 12.00, 120.00, 40.00),
(15, 'Dexamethasone', 'SQR-DX-03/26', 20, 2.50, 1.50, 2.50, 50.00, 20.00),
(16, 'Salbutamol', 'BXP-SB-03/26', 1, 150.00, 100.00, 150.00, 150.00, 50.00);

-- ============================
-- INDEXES
-- ============================
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
-- Haque's Pharmacy inventory
('haque@pharmacy.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 200, 5.00),
('haque@pharmacy.com', 'Seclo', 'Capsule', '20mg', 'Omeprazole', 'Healthcare', 150, 8.00),
('haque@pharmacy.com', 'Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Square', 100, 6.00),
('haque@pharmacy.com', 'Flagyl', 'Tablet', '400mg', 'Metronidazole', 'ACI', 180, 4.00),
('haque@pharmacy.com', 'Azithro', 'Tablet', '500mg', 'Azithromycin', 'Square', 80, 15.00),
('haque@pharmacy.com', 'Maxpro', 'Tablet', '40mg', 'Pantoprazole', 'Square', 120, 10.00),
('haque@pharmacy.com', 'Moxacil', 'Capsule', '500mg', 'Amoxicillin', 'Beximco', 200, 7.00),
('haque@pharmacy.com', 'Ciprocin', 'Tablet', '500mg', 'Ciprofloxacin', 'Square', 90, 8.00),

-- Shahida Medical Store inventory
('shahida@medical.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 300, 4.00),
('shahida@medical.com', 'Zantic', 'Tablet', '150mg', 'Ranitidine', 'Beximco', 100, 5.00),
('shahida@medical.com', 'Alatrol', 'Tablet', '10mg', 'Loratadine', 'Incepta', 80, 3.00),
('shahida@medical.com', 'Ibuprofen', 'Tablet', '400mg', 'Ibuprofen', 'Beximco', 150, 6.00),
('shahida@medical.com', 'Cef-3', 'Capsule', '250mg', 'Cefixime', 'Incepta', 60, 20.00),
('shahida@medical.com', 'Diclofenac', 'Gel', '1%', 'Diclofenac', 'Square', 50, 25.00),
('shahida@medical.com', 'Buscopan', 'Tablet', '10mg', 'Hyoscine', 'ACI', 100, 4.00),
('shahida@medical.com', 'Metformin', 'Tablet', '500mg', 'Metformin', 'Square', 200, 3.00),

-- Alam Brothers Pharma inventory
('alam@pharma.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 250, 5.00),
('alam@pharma.com', 'Clavox', 'Tablet', '625mg', 'Amoxicillin+Clavulanate', 'Square', 70, 25.00),
('alam@pharma.com', 'Rancept', 'Tablet', '40mg', 'Rosuvastatin', 'Square', 100, 12.00),
('alam@pharma.com', 'Montair', 'Tablet', '10mg', 'Montelukast', 'Square', 90, 8.00),
('alam@pharma.com', 'Salbutamol', 'Inhaler', '100mcg', 'Salbutamol', 'Beximco', 30, 150.00),
('alam@pharma.com', 'Nebicard', 'Tablet', '5mg', 'Nebivolol', 'Square', 80, 10.00),
('alam@pharma.com', 'Doxacin', 'Capsule', '100mg', 'Doxycycline', 'Square', 100, 6.00),
('alam@pharma.com', 'Claricin', 'Tablet', '500mg', 'Clarithromycin', 'Beximco', 75, 18.00);

-- Sample Medicine Requests
INSERT IGNORE INTO medicine_request (user_id, user_email, medi_id, medi_name, shop_email, quantity, ppic, status) VALUES
(1, 'rahim@email.com', 1, 'Napa', 'haque@pharmacy.com', 20, 'prescription1.jpg', 1),
(1, 'rahim@email.com', 6, 'Maxpro', 'haque@pharmacy.com', 10, 'prescription2.jpg', 0),
(2, 'fatima@email.com', 4, 'Flagyl', 'shahida@medical.com', 15, 'prescription3.jpg', 1),
(2, 'fatima@email.com', 13, 'Cef-3', 'shahida@medical.com', 8, 'prescription4.jpg', 0),
(3, 'karim@email.com', 17, 'Clavox', 'alam@pharma.com', 12, 'prescription5.jpg', 2),
(3, 'karim@email.com', 21, 'Salbutamol', 'alam@pharma.com', 2, 'prescription6.jpg', 0);

-- ============================
-- INDEXES
-- ============================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_worker_email ON worker(email);
CREATE INDEX idx_medicine_request_user ON medicine_request(user_email);
CREATE INDEX idx_medicine_request_shop ON medicine_request(shop_email);
CREATE INDEX idx_shopmedicine_shop ON shopmedicine(shop_email);

-- ============================
-- VERIFICATION
-- ============================
SELECT 'Database setup complete!' AS message;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_workers FROM worker;
SELECT COUNT(*) AS total_medicines FROM medicine;
SELECT COUNT(*) AS total_shop_inventory FROM shopmedicine;
SELECT COUNT(*) AS total_requests FROM medicine_request;
SHOW TABLES;
