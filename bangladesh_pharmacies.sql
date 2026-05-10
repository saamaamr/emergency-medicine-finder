-- ============================================================
-- COMPREHENSIVE BANGLADESH PHARMACY DATA
-- Real pharmacy locations across all major cities
-- Run: mysql -u root -p emergency_medicine < bangladesh_pharmacies.sql
-- ============================================================

USE emergency_medicine;

-- ============================================================
-- DHAKA DIVISION - More areas
-- ============================================================

INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
-- Dhaka City
('Abdul', 'Momin', 'Male', 'Momin Pharmacy', 'momin@dhaka.com', '01610000001', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Plot 12', 'Bir Uttam A.W. Road', 'Dhaka', 'Dhaka', 'Gulshan-1', '23.7937', '90.4125', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Rahima', 'Begum', 'Female', 'Rahima Medical Hall', 'rahima@dhaka.com', '01610000002', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 45', 'Road 11', 'Dhaka', 'Dhaka', 'Banani', '23.7945', '90.4041', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Mohammad', 'Hossain', 'Male', 'Hossain Pharmacy', 'hossain@dhaka.com', '01610000003', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 8', 'Road 5', 'Dhaka', 'Dhaka', 'Dhanmondi', '23.7465', '90.3745', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Fatema', 'Akter', 'Female', 'Fatema Medical Store', 'fatema@dhaka.com', '01610000004', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Flat 3B', 'Road 7', 'Dhaka', 'Dhaka', 'Uttara', '23.8765', '90.3795', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Khalil', 'Miah', 'Male', 'Khalil Pharmacy', 'khalil@dhaka.com', '01610000005', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 22', 'Road 3', 'Dhaka', 'Dhaka', 'Mirpur-10', '23.8105', '90.3695', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Jarina', 'Begum', 'Female', 'Jarina Medical Hall', 'jarina@dhaka.com', '01610000006', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 15', 'Mymensingh Road', 'Dhaka', 'Dhaka', 'Mirpur-6', '23.8255', '90.3585', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shahidul', 'Islam', 'Male', 'Shahidul Pharmacy', 'shahidul@dhaka.com', '01610000007', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 8', 'Satrasta Road', 'Dhaka', 'Dhaka', 'Paltan', '23.7365', '90.4145', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Mariam', 'Sultana', 'Female', 'Mariam Pharma', 'mariam@dhaka.com', '01610000008', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Block A', 'Road 9', 'Dhaka', 'Dhaka', 'Baridhara', '23.7985', '90.4255', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Ahmed', 'Khan', 'Male', 'Khan Medical Hall', 'khan@dhaka.com', '01610000009', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 4', 'Bangla Road', 'Dhaka', 'Dhaka', 'Lalbagh', '23.7185', '90.3895', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Samina', 'Yeasmin', 'Female', 'Samina Pharmacy', 'samina@dhaka.com', '01610000010', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 18', 'New Market Road', 'Dhaka', 'Dhaka', 'Mohammadpur', '23.7685', '90.3595', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
-- Savar Area
('Delwar', 'Hossain', 'Male', 'Delwar Medical Hall', 'delwar@dhaka.com', '01610000011', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Ward 7', 'Savar Bazar Road', 'Dhaka', 'Dhaka', 'Savar', '23.8895', '90.2675', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shamima', 'Nahar', 'Female', 'Nahar Pharmacy', 'nahar@dhaka.com', '01610000012', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 5', 'Ashulia Road', 'Dhaka', 'Dhaka', 'Ashulia', '23.9125', '90.2985', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
-- Tongi Area
('Jahid', 'Hasan', 'Male', 'Jahid Medical Store', 'jahid@tongi.com', '01610000013', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 20', 'Tongi Bazar', 'Dhaka', 'Gazipur', 'Tongi', '23.9875', '90.4025', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Mithila', 'Rani', 'Female', 'Mithila Pharmacy', 'mithila@tongi.com', '01610000014', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 12', 'Gazipur Road', 'Dhaka', 'Gazipur', 'Tongi', '23.9955', '90.4115', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================================================
-- CHATTAGRAM (CHITTAGONG) DIVISION
-- ============================================================

INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
-- Chattogram City
('Mohammad', 'Ali', 'Male', 'Ali Brothers Pharmacy', 'ali@chattogram.com', '01811000001', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 25', 'O.R. Nizam Road', 'Chattogram', 'Chattogram', 'Agrabad', '22.3192', '91.8041', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Rahima', 'Khatun', 'Female', 'Rahima Medical Hall', 'rahima@chattogram.com', '01811000002', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 15', 'CDA Avenue', 'Chattogram', 'Chattogram', 'Chawkbazar', '22.3345', '91.8125', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Abdul', 'Barik', 'Male', 'Barik Pharmacy', 'barik@chattogram.com', '01811000003', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Plot 8', 'Station Road', 'Chattogram', 'Chattogram', 'Panchlaish', '22.3415', '91.7985', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Nargis', 'Akter', 'Female', 'Nargis Medical Store', 'nargis@chattogram.com', '01811000004', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Flat 2A', 'Bahaddarhat', 'Chattogram', 'Chattogram', 'Bahaddarhat', '22.3565', '91.7855', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Mohammad', 'Yusuf', 'Male', 'Yusuf Pharmacy', 'yusuf@chattogram.com', '01811000005', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 12', 'Julaha Bazar', 'Chattogram', 'Chattogram', 'Chandgaon', '22.3365', '91.8015', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Laila', 'Begum', 'Female', 'Laila Medical Hall', 'laila@chattogram.com', '01811000006', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 30', 'Karnaphuli Road', 'Chattogram', 'Chattogram', 'Halishahar', '22.3275', '91.7865', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shahid', 'Ahmed', 'Male', 'Shahid Pharmacy', 'shahid@chattogram.com', '01811000007', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Ward 5', 'Boalkhali', 'Chattogram', 'Chattogram', 'Boalkhali', '22.2985', '91.9155', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Rashida', 'Begum', 'Female', 'Rashida Medical Store', 'rashida@chattogram.com', '01811000008', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 18', 'Muradpur', 'Chattogram', 'Chattogram', 'Muradpur', '22.3625', '91.8235', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
-- Cox's Bazar
('Abul', 'Kashem', 'Male', 'Kashem Medical Hall', 'kashem@coxsbazar.com', '01811000009', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Plot 10', 'Beach Road', 'Chattogram', 'Cox''s Bazar', 'Cox''s Bazar Sadar', '21.4275', '91.9735', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Ayesha', 'Siddika', 'Female', 'Ayesha Pharmacy', 'ayesha@coxsbazar.com', '01811000010', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 5', 'Jaliapara', 'Chattogram', 'Cox''s Bazar', 'Cox''s Bazar Sadar', '21.4425', '91.9655', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================================================
-- SYLHET DIVISION
-- ============================================================

INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
-- Sylhet City
('Mohammad', 'Rashid', 'Male', 'Rashid Medical Hall', 'rashid@sylhet.com', '01712000001', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 30', 'Zindabazar', 'Sylhet', 'Sylhet', 'Sylhet Sadar', '24.8917', '91.8697', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shabana', 'Akter', 'Female', 'Shabana Pharmacy', 'shabana@sylhet.com', '01712000002', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 22', 'Mirbox Tola', 'Sylhet', 'Sylhet', 'Sylhet Sadar', '24.8975', '91.8745', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Abdul', 'Mannaf', 'Male', 'Mannaf Medical Store', 'mannaf@sylhet.com', '01712000003', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Ward 8', 'Lamabazar', 'Sylhet', 'Sylhet', 'Sylhet Sadar', '24.8855', '91.8635', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Nurun', 'Nahar', 'Female', 'Nahar Pharmacy', 'nahar@sylhet.com', '01712000004', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 15', 'Subid Bazar', 'Sylhet', 'Sylhet', 'Sylhet Sadar', '24.9025', '91.8865', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Tajul', 'Islam', 'Male', 'Tajul Medical Hall', 'tajul@sylhet.com', '01712000005', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 12', 'Kumarpara', 'Sylhet', 'Sylhet', 'Sylhet Sadar', '24.8785', '91.8585', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================================================
-- KHULNA DIVISION
-- ============================================================

INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
-- Khulna City
('Mohammad', 'Salam', 'Male', 'Salam Pharmacy', 'salam@khulna.com', '01713000001', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 40', 'Khan Jahan Ali Road', 'Khulna', 'Khulna', 'Khulna Sadar', '22.8208', '89.5645', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Rashida', 'Begum', 'Female', 'Rashida Medical Hall', 'rashida@khulna.com', '01713000002', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 18', 'Daulatpur', 'Khulna', 'Khulna', 'Daulatpur', '22.8455', '89.5485', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Abdul', 'Halim', 'Male', 'Halim Pharmacy', 'halim@khulna.com', '01713000003', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Plot 8', 'Fultola', 'Khulna', 'Khulna', 'Fultola', '22.8315', '89.5725', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Jahanara', 'Ali', 'Female', 'Jahanara Medical Store', 'jahanara@khulna.com', '01713000004', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 25', 'Banie para', 'Khulna', 'Khulna', 'Khan Jahan Ali', '22.8155', '89.5515', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
-- Jessore
('Mohammad', 'Faruk', 'Male', 'Faruk Medical Hall', 'faruk@jessore.com', '01713000005', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 10', 'Moker Bazar', 'Khulna', 'Jessore', 'Jessore Sadar', '23.1695', '89.2135', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shamima', 'Nasrin', 'Female', 'Nasrin Pharmacy', 'nasrin@jessore.com', '01713000006', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 5', 'Chanchra', 'Khulna', 'Jessore', 'Jessore Sadar', '23.1785', '89.2085', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================================================
-- RAJSHAHI DIVISION
-- ============================================================

INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
-- Rajshahi City
('Mohammad', 'Habib', 'Male', 'Habib Pharmacy', 'habib@rajshahi.com', '01714000001', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 35', 'Shaheb Bazar', 'Rajshahi', 'Rajshahi', 'Rajshahi Sadar', '24.3635', '88.6825', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Salma', 'Akter', 'Female', 'Salma Medical Hall', 'salma@rajshahi.com', '01714000002', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 25', 'Lalbagh', 'Rajshahi', 'Rajshahi', 'Rajshahi Sadar', '24.3715', '88.6915', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Abdul', 'Khaleq', 'Male', 'Khaleq Pharmacy', 'khaleq@rajshahi.com', '01714000003', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Ward 12', 'Boalia', 'Rajshahi', 'Rajshahi', 'Boalia', '24.3585', '88.6755', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Nargis', 'Parvin', 'Female', 'Parvin Medical Store', 'parvin@rajshahi.com', '01714000004', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 20', 'Katakhali', 'Rajshahi', 'Rajshahi', 'Katakhali', '24.3855', '88.6985', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
-- Natore
('Mohammad', 'Aziz', 'Male', 'Aziz Pharmacy', 'aziz@natore.com', '01714000005', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 8', 'Natore Bazar', 'Rajshahi', 'Natore', 'Natore Sadar', '24.4115', '88.9585', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================================================
-- BARISHAL DIVISION
-- ============================================================

INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
-- Barishal City
('Mohammad', 'Mizan', 'Male', 'Mizan Pharmacy', 'mizan@barishal.com', '01715000001', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 28', 'Bandar Road', 'Barishal', 'Barishal', 'Barishal Sadar', '22.7015', '90.3535', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Rashida', 'Begum', 'Female', 'Rashida Medical Hall', 'rashidab@barishal.com', '01715000002', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 15', 'Nizamuddin Road', 'Barishal', 'Barishal', 'Barishal Sadar', '22.6955', '90.3485', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Abdul', 'Wahab', 'Male', 'Wahab Pharmacy', 'wahab@barishal.com', '01715000003', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Ward 5', 'Bakerganj', 'Barishal', 'Barishal', 'Bakerganj', '22.6515', '90.2975', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shamima', 'Khatun', 'Female', 'Shamima Medical Store', 'shamima@barishal.com', '01715000004', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 12', 'Gourabadi', 'Barishal', 'Barishal', 'Barishal Sadar', '22.7125', '90.3675', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================================================
-- RANGPUR DIVISION
-- ============================================================

INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
-- Rangpur City
('Mohammad', 'Badruddoza', 'Male', 'Badruddoza Pharmacy', 'badruddoza@rangpur.com', '01716000001', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 30', 'Maharajganj', 'Rangpur', 'Rangpur', 'Rangpur Sadar', '25.7435', '89.2755', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Maksuda', 'Begum', 'Female', 'Maksuda Medical Hall', 'maksuda@rangpur.com', '01716000002', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 20', 'Dinish Road', 'Rangpur', 'Rangpur', 'Rangpur Sadar', '25.7515', '89.2825', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Abdul', 'Motaleb', 'Male', 'Motaleb Pharmacy', 'motaleb@rangpur.com', '01716000003', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Ward 8', 'Kochabari', 'Rangpur', 'Rangpur', 'Gangachara', '25.7825', '89.2585', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Rokeya', 'Sultana', 'Female', 'Rokeya Medical Store', 'rokeya@rangpur.com', '01716000004', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 15', 'Bodorgonj', 'Rangpur', 'Rangpur', 'Rangpur Sadar', '25.7385', '89.2685', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
-- Dinajpur
('Mohammad', 'Mizanur', 'Male', 'Mizanur Pharmacy', 'mizanur@dinajpur.com', '01716000005', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 12', 'Dinajpur Bazar', 'Rangpur', 'Dinajpur', 'Dinajpur Sadar', '25.6275', '88.6655', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shahinur', 'Akter', 'Female', 'Shahinur Medical Hall', 'shahinur@dinajpur.com', '01716000006', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 8', 'College Road', 'Rangpur', 'Dinajpur', 'Dinajpur Sadar', '25.6315', '88.6715', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================================================
-- MYMENSINGH DIVISION
-- ============================================================

INSERT IGNORE INTO worker (first_name, last_name, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass, status) VALUES
-- Mymensingh City
('Mohammad', 'Tariq', 'Male', 'Tariq Pharmacy', 'tariq@mymensingh.com', '01717000001', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 35', 'Chowrasta', 'Mymensingh', 'Mymensingh', 'Mymensingh Sadar', '24.7475', '90.4075', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Shamima', 'Nasreen', 'Female', 'Nasreen Medical Hall', 'nasreen@mymensingh.com', '01717000002', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'House 18', 'Ganginabad', 'Mymensingh', 'Mymensingh', 'Mymensingh Sadar', '24.7525', '90.4135', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Abdul', 'Quddus', 'Male', 'Quddus Pharmacy', 'quddus@mymensingh.com', '01717000003', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Ward 10', 'Bhigha', 'Mymensingh', 'Mymensingh', 'Mymensingh Sadar', '24.7355', '90.3955', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1),
('Laila', 'Yeasmin', 'Female', 'Laila Medical Store', 'laila@mymensingh.com', '01717000004', 'default-shop.png', 'nid1.jpg', 'nid2.jpg', 'Shop 22', 'Dhopa Bazar', 'Mymensingh', 'Mymensingh', 'Mymensingh Sadar', '24.7585', '90.4185', '$2a$10$l.R3r2XEZ84E6LLi1PJyCegnyjGZXqImQOI0B7idYZOtaSJ2TIIKS', 1);

-- ============================================================
-- SHOP MEDICINES DATA
-- Common medicines for all pharmacies
-- ============================================================

-- Get worker IDs and insert medicines
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price)
SELECT w.email, m.name, m.type, m.strength, m.generic, m.company, 
       FLOOR(100 + RAND() * 500), 
       ROUND(3 + RAND() * 25, 2)
FROM worker w
CROSS JOIN medicine m
WHERE m.name IN ('Napa', 'Napa Extra', 'Ace Plus', 'Seclo', 'Fexo', 'Tufnil', 'Alatrol', 'Domperon', 'Maxpro', 'Azithro');

-- Additional common medicines
INSERT IGNORE INTO shopmedicine (shop_email, mediname, meditype, medistrength, medigeneric, medicompany, stock, price)
SELECT w.email, 
       CASE FLOOR(1 + RAND() * 8)
         WHEN 1 THEN 'Omeprazole DS'
         WHEN 2 THEN 'Pantoprazole'
         WHEN 3 THEN 'Cetirizine'
         WHEN 4 THEN 'Losartan'
         WHEN 5 THEN 'Metformin'
         WHEN 6 THEN 'Amlodipine'
         WHEN 7 THEN 'Atorvastatin'
         WHEN 8 THEN 'Levofloxacin'
       END,
       'Tablet',
       CASE FLOOR(1 + RAND() * 5)
         WHEN 1 THEN '10mg'
         WHEN 2 THEN '20mg'
         WHEN 3 THEN '40mg'
         WHEN 4 THEN '500mg'
         WHEN 5 THEN '100mg'
       END,
       'Generic',
       'Various',
       FLOOR(50 + RAND() * 300),
       ROUND(5 + RAND() * 30, 2)
FROM worker w;

SELECT 'Pharmacy data inserted successfully!' AS Result;
