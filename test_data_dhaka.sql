-- ============================================================
-- TEST DATA SCRIPT: Dhaka-based medicine, shop & user data
-- Run AFTER database_setup.sql to populate test data
-- All shop locations are in Dhaka, Bangladesh for map testing
-- ============================================================

USE emergency_medicine;

-- ============================================================
-- MORE USERS (Dhaka addresses)
-- ============================================================
INSERT IGNORE INTO users (first_name, last_name, gender, email, phone, propic, house, road, division, zila, upazila, pass, status) VALUES
('Tanvir', 'Ahmed', 'Male', 'tanvir@email.com', '01712345678', 'default-user.png', 'House 12', 'Road 5', 'Dhaka', 'Dhaka', 'Mirpur', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1),
('Nusrat', 'Jahan', 'Female', 'nusrat@email.com', '01723456789', 'default-user.png', 'Flat 3A', 'Road 7', 'Dhaka', 'Dhaka', 'Gulshan', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1),
('Hasan', 'Mahmud', 'Male', 'hasan@email.com', '01734567890', 'default-user.png', 'House 45', 'Road 12', 'Dhaka', 'Dhaka', 'Uttara', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1),
('Farida', 'Yasmin', 'Female', 'farida@email.com', '01745678901', 'default-user.png', 'House 8', 'Road 3', 'Dhaka', 'Dhaka', 'Dhanmondi', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1),
('Kamal', 'Hossain', 'Male', 'kamal@email.com', '01756789012', 'default-user.png', 'House 20', 'Road 9', 'Dhaka', 'Dhaka', 'Mohammadpur', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1),
('Shamim', 'Reza', 'Male', 'shamim@email.com', '01767890123', 'default-user.png', 'Flat 7B', 'Road 15', 'Dhaka', 'Dhaka', 'Banani', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1),
('Ayesha', 'Begum', 'Female', 'ayesha@email.com', '01778901234', 'default-user.png', 'House 3', 'Road 2', 'Dhaka', 'Dhaka', 'Farmgate', '$2a$10$wzweneMmiQg6N5Uxn8mvqupWQSxYxljdvsuCtwiEZw.ELAaRYdYfi', 1);

-- ============================================================
-- MORE SHOPKEEPERS (Various Dhaka locations - lat/lng for map)
-- ============================================================
INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
('Mohammad', 'Ali', 'Male', 'Ali Medical Hall', 'ali@pharmacy.com', '01911111111', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 5', 'Road 4', 'Dhaka', 'Dhaka', 'Gulshan-1', '23.7937', '90.4119', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Rafiq', 'Uddin', 'Male', 'Rafiq Pharmacy', 'rafiq@pharmacy.com', '01922222222', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 15', 'Road 8', 'Dhaka', 'Dhaka', 'Dhanmondi-15', '23.7464', '90.3746', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shamima', 'Akter', 'Female', 'Shamima Medical Store', 'shamima@medical.com', '01933333333', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 12', 'Road 6', 'Dhaka', 'Dhaka', 'Banani', '23.7943', '90.4039', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Abul', 'Kashem', 'Male', 'Kashem Medicine Corner', 'kashem@pharmacy.com', '01944444444', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 22', 'Road 10', 'Dhaka', 'Dhaka', 'Motijheel', '23.7322', '90.4169', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Nazma', 'Begum', 'Female', 'Nazma Pharma', 'nazma@pharmacy.com', '01955555555', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 8', 'Road 3', 'Dhaka', 'Dhaka', 'Farmgate', '23.7578', '90.3908', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Mizanur', 'Rahman', 'Male', 'Mizan Pharmacy', 'mizan@pharmacy.com', '01966666666', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 5', 'Road 2', 'Dhaka', 'Dhaka', 'Mirpur-11', '23.8153', '90.3619', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Rokeya', 'Sultana', 'Female', 'Rokeya Medical Hall', 'rokeya@medical.com', '01977777777', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 15', 'Road 7', 'Dhaka', 'Dhaka', 'Mohammadpur', '23.7669', '90.3586', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Jahid', 'Hasan', 'Male', 'Jahid Medicine Shop', 'jahid@pharmacy.com', '01988888888', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 30', 'Road 11', 'Dhaka', 'Dhaka', 'Bashundhara', '23.8147', '90.4046', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================================================
-- ADDITIONAL MEDICINES (Common Bangladeshi medicines)
-- ============================================================
INSERT IGNORE INTO medicine (name, type, strength, generic, company) VALUES
('Fexofenadine', 'Tablet', '120mg', 'Fexofenadine HCl', 'ACI Limited'),
('Losartan Plus', 'Tablet', '50mg+12.5mg', 'Losartan + Hydrochlorothiazide', 'Square Pharmaceuticals'),
('Omega-3', 'Capsule', '1000mg', 'Omega-3 Fatty Acids', 'SMC Enterprise'),
('Vitamin C', 'Tablet', '500mg', 'Ascorbic Acid', 'ACI Limited'),
('Zinc Sulfate', 'Tablet', '20mg', 'Zinc Sulfate Monohydrate', 'Healthcare Pharmaceuticals'),
('Multivitamin', 'Tablet', 'Multivitamin', 'Multivitamin + Minerals', 'Square Pharmaceuticals'),
('Pantoprazole', 'Tablet', '40mg', 'Pantoprazole Sodium', 'Beximco Pharmaceuticals'),
('Esomeprazole', 'Tablet', '40mg', 'Esomeprazole', 'Incepta Pharmaceuticals'),
('Ranitidine', 'Tablet', '150mg', 'Ranitidine HCl', 'Beximco Pharmaceuticals'),
('Cefixime DS', 'Capsule', '200mg', 'Cefixime Trihydrate', 'Healthcare Pharmaceuticals'),
('Azithromycin DS', 'Tablet', '500mg', 'Azithromycin', 'ACI Limited'),
('Levofloxacin', 'Tablet', '500mg', 'Levofloxacin', 'Square Pharmaceuticals'),
('Ciprofloxacin', 'Tablet', '500mg', 'Ciprofloxacin', 'Beximco Pharmaceuticals'),
('Omeprazole DS', 'Capsule', '40mg', 'Omeprazole', 'Incepta Pharmaceuticals'),
('Domperidone', 'Tablet', '10mg', 'Domperidone Maleate', 'Square Pharmaceuticals'),
('Ondansetron', 'Tablet', '4mg', 'Ondansetron', 'Healthcare Pharmaceuticals'),
('Metoclopramide', 'Tablet', '10mg', 'Metoclopramide HCl', 'ACI Limited'),
('Losartan Potassium', 'Tablet', '50mg', 'Losartan Potassium', 'Square Pharmaceuticals'),
('Amlodipine', 'Tablet', '5mg', 'Amlodipine Besylate', 'Beximco Pharmaceuticals'),
('Atorvastatin', 'Tablet', '10mg', 'Atorvastatin Calcium', 'Square Pharmaceuticals'),
('Bisoprolol', 'Tablet', '5mg', 'Bisoprolol Fumarate', 'Incepta Pharmaceuticals'),
('Nitroglycerin', 'Tablet', '0.5mg', 'Nitroglycerin', 'ACI Limited'),
('Salbutamol DS', 'Tablet', '4mg', 'Salbutamol', 'Square Pharmaceuticals'),
('Montelukast', 'Tablet', '10mg', 'Montelukast Sodium', 'Healthcare Pharmaceuticals'),
('Fexofenadine DS', 'Tablet', '180mg', 'Fexofenadine HCl', 'ACI Limited'),
('Prednisolone DS', 'Tablet', '10mg', 'Prednisolone', 'Beximco Pharmaceuticals'),
('Dexamethasone DS', 'Tablet', '5mg', 'Dexamethasone', 'Incepta Pharmaceuticals'),
('Insulin NPH', 'Injection', '100IU/ml', 'Human Insulin Isophane', 'Novo Nordisk');

-- ============================================================
-- SHOP INVENTORY (Each shop has 6-10 medicines with stock & price)
-- ============================================================

-- Ali Medical Hall (Gulshan, lat: 23.7937, lng: 90.4119)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('ali@pharmacy.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 500, 4.00),
('ali@pharmacy.com', 'Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Square', 200, 6.00),
('ali@pharmacy.com', 'Seclo', 'Capsule', '20mg', 'Omeprazole', 'Healthcare', 150, 8.00),
('ali@pharmacy.com', 'Flagyl', 'Tablet', '400mg', 'Metronidazole', 'ACI', 300, 3.50),
('ali@pharmacy.com', 'Maxpro', 'Tablet', '40mg', 'Pantoprazole', 'Square', 120, 10.00),
('ali@pharmacy.com', 'Amlodipine', 'Tablet', '5mg', 'Amlodipine', 'Beximco', 180, 5.00),
('ali@pharmacy.com', 'Metformin', 'Tablet', '500mg', 'Metformin', 'Square', 250, 3.00),
('ali@pharmacy.com', 'Montair', 'Tablet', '10mg', 'Montelukast', 'Square', 100, 8.00);

-- Rafiq Pharmacy (Dhanmondi, lat: 23.7464, lng: 90.3746)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('rafiq@pharmacy.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 600, 5.00),
('rafiq@pharmacy.com', 'Azithro', 'Tablet', '500mg', 'Azithromycin', 'Square', 90, 14.00),
('rafiq@pharmacy.com', 'Ciprocin', 'Tablet', '500mg', 'Ciprofloxacin', 'Square', 120, 8.00),
('rafiq@pharmacy.com', 'Moxacil', 'Capsule', '500mg', 'Amoxicillin', 'Beximco', 200, 6.00),
('rafiq@pharmacy.com', 'Losartan Plus', 'Tablet', '50mg+12.5mg', 'Losartan + HCTZ', 'Square', 100, 7.00),
('rafiq@pharmacy.com', 'Atorvastatin', 'Tablet', '10mg', 'Atorvastatin', 'Square', 130, 9.00),
('rafiq@pharmacy.com', 'Rancept', 'Tablet', '40mg', 'Rosuvastatin', 'Square', 80, 12.00),
('rafiq@pharmacy.com', 'Vitamin C', 'Tablet', '500mg', 'Ascorbic Acid', 'ACI', 400, 2.00);

-- Shamima Medical Store (Banani, lat: 23.7943, lng: 90.4039)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('shamima@medical.com', 'Napa Extra', 'Tablet', '500mg+65mg', 'Paracetamol+Caffeine', 'Beximco', 250, 6.00),
('shamima@medical.com', 'Tufnil', 'Tablet', '10mg', 'Cetirizine', 'Incepta', 150, 3.00),
('shamima@medical.com', 'Flagyl', 'Tablet', '400mg', 'Metronidazole', 'ACI', 180, 4.00),
('shamima@medical.com', 'Moxacil', 'Capsule', '500mg', 'Amoxicillin', 'Beximco', 160, 6.50),
('shamima@medical.com', 'Diclofenac', 'Gel', '1%', 'Diclofenac', 'Square', 60, 25.00),
('shamima@medical.com', 'Bisoprolol', 'Tablet', '5mg', 'Bisoprolol', 'Incepta', 90, 8.00),
('shamima@medical.com', 'Salbutamol', 'Inhaler', '100mcg', 'Salbutamol', 'Beximco', 25, 150.00);

-- Kashem Medicine Corner (Motijheel, lat: 23.7322, lng: 90.4169)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('kashem@pharmacy.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 450, 4.50),
('kashem@pharmacy.com', 'Seclo', 'Capsule', '20mg', 'Omeprazole', 'Healthcare', 200, 7.00),
('kashem@pharmacy.com', 'Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Square', 120, 6.00),
('kashem@pharmacy.com', 'Cef-3', 'Capsule', '250mg', 'Cefixime', 'Incepta', 80, 18.00),
('kashem@pharmacy.com', 'Maxpro', 'Tablet', '40mg', 'Pantoprazole', 'Square', 100, 10.00),
('kashem@pharmacy.com', 'Nebicard', 'Tablet', '5mg', 'Nebivolol', 'Square', 70, 12.00),
('kashem@pharmacy.com', 'Montair', 'Tablet', '10mg', 'Montelukast', 'Square', 110, 8.00),
('kashem@pharmacy.com', 'Zinc Sulfate', 'Tablet', '20mg', 'Zinc Sulfate', 'Healthcare', 200, 2.50);

-- Nazma Pharma (Farmgate, lat: 23.7578, lng: 90.3908)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('nazma@pharmacy.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 350, 5.00),
('nazma@pharmacy.com', 'Ace Plus', 'Tablet', '500mg+65mg', 'Paracetamol+Caffeine', 'Square', 180, 6.00),
('nazma@pharmacy.com', 'Flagyl', 'Tablet', '400mg', 'Metronidazole', 'ACI', 220, 4.00),
('nazma@pharmacy.com', 'Azithro', 'Tablet', '500mg', 'Azithromycin', 'Square', 60, 15.00),
('nazma@pharmacy.com', 'Omeprazole DS', 'Capsule', '40mg', 'Omeprazole', 'Incepta', 140, 9.00),
('nazma@pharmacy.com', 'Multivitamin', 'Tablet', 'Multivitamin', 'Multi+Mineral', 'Square', 300, 5.00),
('nazma@pharmacy.com', 'Clavox', 'Tablet', '625mg', 'Amoxicillin+Clavulanate', 'Square', 50, 28.00);

-- Mizan Pharmacy (Mirpur, lat: 23.8153, lng: 90.3619)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('mizan@pharmacy.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 550, 4.00),
('mizan@pharmacy.com', 'Seclo', 'Capsule', '20mg', 'Omeprazole', 'Healthcare', 130, 8.00),
('mizan@pharmacy.com', 'Tufnil', 'Tablet', '10mg', 'Cetirizine', 'Incepta', 170, 3.00),
('mizan@pharmacy.com', 'Alatrol', 'Tablet', '10mg', 'Loratadine', 'Incepta', 140, 3.00),
('mizan@pharmacy.com', 'Ibuprofen', 'Tablet', '400mg', 'Ibuprofen', 'Beximco', 200, 5.00),
('mizan@pharmacy.com', 'Dexamethasone', 'Tablet', '0.5mg', 'Dexamethasone', 'Square', 250, 2.00),
('mizan@pharmacy.com', 'Diazepam', 'Tablet', '5mg', 'Diazepam', 'Square', 50, 4.00);

-- Rokeya Medical Hall (Mohammadpur, lat: 23.7669, lng: 90.3586)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('rokeya@medical.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 400, 5.00),
('rokeya@medical.com', 'Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Square', 90, 7.00),
('rokeya@medical.com', 'Ciprocin', 'Tablet', '500mg', 'Ciprofloxacin', 'Square', 100, 8.00),
('rokeya@medical.com', 'Domperon', 'Tablet', '10mg', 'Domperidone', 'Incepta', 130, 4.00),
('rokeya@medical.com', 'Zantic', 'Tablet', '150mg', 'Ranitidine', 'Beximco', 180, 4.00),
('rokeya@medical.com', 'Ondansetron', 'Tablet', '4mg', 'Ondansetron', 'Healthcare', 80, 6.00),
('rokeya@medical.com', 'Losartan Potassium', 'Tablet', '50mg', 'Losartan', 'Square', 120, 7.00),
('rokeya@medical.com', 'Metformin', 'Tablet', '500mg', 'Metformin', 'Square', 280, 3.00);

-- Jahid Medicine Shop (Bashundhara, lat: 23.8147, lng: 90.4046)
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price) VALUES
('jahid@pharmacy.com', 'Napa Extra', 'Tablet', '500mg+65mg', 'Paracetamol+Caffeine', 'Beximco', 200, 6.00),
('jahid@pharmacy.com', 'Azithro', 'Tablet', '500mg', 'Azithromycin', 'Square', 70, 15.00),
('jahid@pharmacy.com', 'Clavox', 'Tablet', '625mg', 'Amoxicillin+Clavulanate', 'Square', 40, 30.00),
('jahid@pharmacy.com', 'Moxacil', 'Capsule', '500mg', 'Amoxicillin', 'Beximco', 220, 6.00),
('jahid@pharmacy.com', 'Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Square', 110, 6.50),
('jahid@pharmacy.com', 'Amlodipine', 'Tablet', '5mg', 'Amlodipine', 'Beximco', 150, 5.00),
('jahid@pharmacy.com', 'Atorvastatin', 'Tablet', '10mg', 'Atorvastatin', 'Square', 90, 10.00),
('jahid@pharmacy.com', 'Vitamin C', 'Tablet', '500mg', 'Ascorbic Acid', 'ACI', 350, 2.00),
('jahid@pharmacy.com', 'Zinc Sulfate', 'Tablet', '20mg', 'Zinc Sulfate', 'Healthcare', 180, 2.50);

-- ============================================================
-- MORE MEDICINE REQUESTS (for testing user order flow)
-- ============================================================
INSERT IGNORE INTO medicine_request (user_id, user_email, medi_id, medi_name, shop_email, quantity, ppic, status) VALUES
(4, 'tanvir@email.com', 1, 'Napa', 'ali@pharmacy.com', 30, 'prescription1.jpg', 0),
(4, 'tanvir@email.com', 7, 'Maxpro', 'rafiq@pharmacy.com', 15, 'prescription2.jpg', 1),
(5, 'nusrat@email.com', 11, 'Ciprocin', 'shamima@medical.com', 20, 'prescription3.jpg', 0),
(5, 'nusrat@email.com', 3, 'Seclo', 'kashem@pharmacy.com', 10, 'prescription4.jpg', 2),
(6, 'hasan@email.com', 1, 'Napa', 'nazma@pharmacy.com', 50, 'prescription5.jpg', 1),
(6, 'hasan@email.com', 21, 'Azithro', 'jahid@pharmacy.com', 12, 'prescription6.jpg', 0),
(7, 'farida@email.com', 5, 'Flagyl', 'mizan@pharmacy.com', 25, 'prescription7.jpg', 0),
(7, 'farida@email.com', 9, 'Fexo', 'rokeya@medical.com', 10, 'prescription8.jpg', 1);

-- ============================================================
-- VERIFICATION
-- ============================================================
SELECT 'Test data inserted successfully!' AS message;
SELECT CONCAT(COUNT(*), ' total medicines') AS info FROM medicine;
SELECT CONCAT(COUNT(*), ' total users') AS info FROM users;
SELECT CONCAT(COUNT(*), ' total shopkeepers') AS info FROM worker;
SELECT CONCAT(COUNT(*), ' total shop inventory items') AS info FROM shopmedicine;
SELECT CONCAT(COUNT(*), ' total medicine requests') AS info FROM medicine_request;
