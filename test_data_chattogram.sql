-- ============================================================
-- TEST DATA: Shops near your location (Chattogram)
-- ============================================================

USE emergency_medicine;

-- New shopkeepers near 22.337021, 91.796935 (Chattogram)
INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
('Nurul', 'Islam', 'Male', 'Nurul Pharmacy', 'nurul@ctg.com', '01999911111', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 10', 'Road 2', 'Chattogram', 'Chattogram', 'Panchlaish', '22.3400', '91.7950', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Jasim', 'Uddin', 'Male', 'Jasim Medical Store', 'jasim@ctg.com', '01999922222', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 5', 'Road 8', 'Chattogram', 'Chattogram', 'Chandgaon', '22.3350', '91.8000', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Hafiz', 'Ahmed', 'Male', 'Hafiz Medicine Corner', 'hafiz@ctg.com', '01999933333', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 22', 'Road 5', 'Chattogram', 'Chattogram', 'Bakolia', '22.3300', '91.7900', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Sultana', 'Razia', 'Female', 'Sultana Pharma', 'sultana@ctg.com', '01999944444', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Flat 3A', 'Road 12', 'Chattogram', 'Chattogram', 'Halishahar', '22.3270', '91.7850', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Sharif', 'Hossain', 'Male', 'Sharif Medical Hall', 'sharif@ctg.com', '01999955555', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 15', 'Road 3', 'Chattogram', 'Chattogram', 'Agrabad', '22.3200', '91.8100', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Farzana', 'Begum', 'Female', 'Farzana Pharmacy', 'farzana@ctg.com', '01999966666', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 7', 'Road 6', 'Chattogram', 'Chattogram', 'Nasirabad', '22.3450', '91.8000', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- Inventory for Nurul Pharmacy (22.3400, 91.7950)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('nurul@ctg.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 400, 4.00),
('nurul@ctg.com', 'Napa Extra', 'Tablet', '500mg+65mg', 'Paracetamol+Caffeine', 'Beximco', 200, 6.00),
('nurul@ctg.com', 'Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Square', 100, 6.00),
('nurul@ctg.com', 'Seclo', 'Capsule', '20mg', 'Omeprazole', 'Healthcare', 150, 8.00),
('nurul@ctg.com', 'Flagyl', 'Tablet', '400mg', 'Metronidazole', 'ACI', 180, 3.50),
('nurul@ctg.com', 'Maxpro', 'Tablet', '40mg', 'Pantoprazole', 'Square', 90, 10.00),
('nurul@ctg.com', 'Azithro', 'Tablet', '500mg', 'Azithromycin', 'Square', 60, 15.00),
('nurul@ctg.com', 'Moxacil', 'Capsule', '500mg', 'Amoxicillin', 'Beximco', 200, 6.00),
('nurul@ctg.com', 'Amlodipine', 'Tablet', '5mg', 'Amlodipine', 'Beximco', 150, 5.00),
('nurul@ctg.com', 'Vitamin C', 'Tablet', '500mg', 'Ascorbic Acid', 'ACI', 300, 2.00);

-- Inventory for Jasim Medical Store (22.3350, 91.8000)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('jasim@ctg.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 350, 5.00),
('jasim@ctg.com', 'Ace Plus', 'Tablet', '500mg+65mg', 'Paracetamol+Caffeine', 'Square', 150, 7.00),
('jasim@ctg.com', 'Tufnil', 'Tablet', '10mg', 'Cetirizine', 'Incepta', 120, 3.00),
('jasim@ctg.com', 'Seclo', 'Capsule', '20mg', 'Omeprazole', 'Healthcare', 100, 8.00),
('jasim@ctg.com', 'Ciprocin', 'Tablet', '500mg', 'Ciprofloxacin', 'Square', 80, 8.00),
('jasim@ctg.com', 'Cef-3', 'Capsule', '250mg', 'Cefixime', 'Incepta', 50, 20.00),
('jasim@ctg.com', 'Metformin', 'Tablet', '500mg', 'Metformin', 'Square', 250, 3.00),
('jasim@ctg.com', 'Montair', 'Tablet', '10mg', 'Montelukast', 'Square', 90, 8.00),
('jasim@ctg.com', 'Zinc Sulfate', 'Tablet', '20mg', 'Zinc Sulfate', 'Healthcare', 200, 2.50);

-- Inventory for Hafiz Medicine Corner (22.3300, 91.7900)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('hafiz@ctg.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 500, 4.00),
('hafiz@ctg.com', 'Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Square', 80, 7.00),
('hafiz@ctg.com', 'Alatrol', 'Tablet', '10mg', 'Loratadine', 'Incepta', 100, 3.00),
('hafiz@ctg.com', 'Zantic', 'Tablet', '150mg', 'Ranitidine', 'Beximco', 200, 4.00),
('hafiz@ctg.com', 'Moxacil', 'Capsule', '500mg', 'Amoxicillin', 'Beximco', 180, 6.00),
('hafiz@ctg.com', 'Ibuprofen', 'Tablet', '400mg', 'Ibuprofen', 'Beximco', 150, 5.00),
('hafiz@ctg.com', 'Dexamethasone', 'Tablet', '0.5mg', 'Dexamethasone', 'Square', 300, 2.00),
('hafiz@ctg.com', 'Multivitamin', 'Tablet', 'Multivitamin', 'Multi+Mineral', 'Square', 250, 5.00);

-- Inventory for Sultana Pharma (22.3270, 91.7850)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('sultana@ctg.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 300, 5.00),
('sultana@ctg.com', 'Napa Extra', 'Tablet', '500mg+65mg', 'Paracetamol+Caffeine', 'Beximco', 180, 6.00),
('sultana@ctg.com', 'Clavox', 'Tablet', '625mg', 'Amoxicillin+Clavulanate', 'Square', 40, 28.00),
('sultana@ctg.com', 'Flagyl', 'Tablet', '400mg', 'Metronidazole', 'ACI', 200, 4.00),
('sultana@ctg.com', 'Rancept', 'Tablet', '40mg', 'Rosuvastatin', 'Square', 80, 12.00),
('sultana@ctg.com', 'Nebicard', 'Tablet', '5mg', 'Nebivolol', 'Square', 60, 10.00),
('sultana@ctg.com', 'Domperon', 'Tablet', '10mg', 'Domperidone', 'Incepta', 120, 4.00),
('sultana@ctg.com', 'Buscopan', 'Tablet', '10mg', 'Hyoscine', 'ACI', 100, 5.00);

-- Inventory for Sharif Medical Hall (22.3200, 91.8100)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('sharif@ctg.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 450, 4.00),
('sharif@ctg.com', 'Azithro', 'Tablet', '500mg', 'Azithromycin', 'Square', 70, 14.00),
('sharif@ctg.com', 'Maxpro', 'Tablet', '40mg', 'Pantoprazole', 'Square', 110, 10.00),
('sharif@ctg.com', 'Losartan Potassium', 'Tablet', '50mg', 'Losartan', 'Square', 130, 7.00),
('sharif@ctg.com', 'Atorvastatin', 'Tablet', '10mg', 'Atorvastatin', 'Square', 100, 9.00),
('sharif@ctg.com', 'Amlodipine', 'Tablet', '5mg', 'Amlodipine', 'Beximco', 140, 5.00),
('sharif@ctg.com', 'Ondansetron', 'Tablet', '4mg', 'Ondansetron', 'Healthcare', 80, 6.00),
('sharif@ctg.com', 'Salbutamol', 'Inhaler', '100mcg', 'Salbutamol', 'Beximco', 30, 150.00),
('sharif@ctg.com', 'Vitamin C', 'Tablet', '500mg', 'Ascorbic Acid', 'ACI', 400, 2.00);

-- Inventory for Farzana Pharmacy (22.3450, 91.8000)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('farzana@ctg.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 350, 5.00),
('farzana@ctg.com', 'Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Square', 90, 6.50),
('farzana@ctg.com', 'Seclo', 'Capsule', '20mg', 'Omeprazole', 'Healthcare', 120, 8.00),
('farzana@ctg.com', 'Ciprocin', 'Tablet', '500mg', 'Ciprofloxacin', 'Square', 100, 8.00),
('farzana@ctg.com', 'Clavox', 'Tablet', '625mg', 'Amoxicillin+Clavulanate', 'Square', 30, 30.00),
('farzana@ctg.com', 'Montair', 'Tablet', '10mg', 'Montelukast', 'Square', 80, 8.00),
('farzana@ctg.com', 'Metformin', 'Tablet', '500mg', 'Metformin', 'Square', 220, 3.00),
('farzana@ctg.com', 'Zinc Sulfate', 'Tablet', '20mg', 'Zinc Sulfate', 'Healthcare', 180, 2.50),
('farzana@ctg.com', 'Omega-3', 'Capsule', '1000mg', 'Omega-3', 'SMC', 100, 12.00);

SELECT 'Chattogram test data added!' AS message;
SELECT CONCAT(COUNT(*), ' total shopkeepers now') AS info FROM worker;
SELECT CONCAT(COUNT(*), ' total shop inventory items now') AS info FROM shopmedicine;
