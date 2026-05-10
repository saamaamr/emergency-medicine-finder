-- ============================================================
-- COMPREHENSIVE BANGLADESH MEDICINES DATABASE
-- Based on typical Bangladesh pharma products
-- ============================================================

USE emergency_medicine;

-- Clear existing medicines
DELETE FROM medicine;

-- ============================================================
-- ANTIPYRETICS & PAIN RELIEVERS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco Pharmaceuticals'),
('Napa Extra', 'Tablet', '650mg', 'Paracetamol', 'Beximco Pharmaceuticals'),
('Napa Quick', 'Tablet', '500mg', 'Paracetamol', 'Incepta Pharmaceuticals'),
('Pyridor', 'Tablet', '500mg', 'Paracetamol', 'Square Pharmaceuticals'),
('Pirox', 'Tablet', '400mg', 'Paracetamol', 'Opsonin Pharma'),
('Calpol', 'Syrup', '120mg/5ml', 'Paracetamol', 'ACME Laboratories'),
('Renova', 'Injection', '150mg/ml', 'Paracetamol', 'Renata'),
('Fevastat', 'Tablet', '500mg', 'Paracetamol', 'Ziska Pharmaceuticals'),
('Feverall', 'Tablet', '500mg', 'Paracetamol', 'Drug International'),
('Ace Plus', 'Tablet', '400mg+325mg', 'Paracetamol+Caffeine', 'Beximco Pharmaceuticals');

-- ============================================================
-- NSAIDs
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Seclo', 'Tablet', '20mg', 'Celecoxib', 'Incepta Pharmaceuticals'),
('Arcoxia', 'Tablet', '60mg', 'Etoricoxib', 'Merck Bangladesh'),
('Coxen', 'Tablet', '90mg', 'Etoricoxib', 'Ziska Pharmaceuticals'),
('Loxid', 'Tablet', '7.5mg', 'Lornoxicam', 'Opsonin Pharma'),
('Fexo', 'Tablet', '120mg', 'Fexofenadine', 'Beximco Pharmaceuticals'),
('Fexofen', 'Tablet', '180mg', 'Fexofenadine', 'Square Pharmaceuticals'),
('Tafen', 'Tablet', '50mg', 'Nimesulide', 'Beximco Pharmaceuticals'),
('Nimul', 'Tablet', '100mg', 'Nimesulide', 'Incepta Pharmaceuticals'),
('Maxon', 'Tablet', '400mg', 'Ibuprofen', 'Opsonin Pharma'),
('Ibufen', 'Tablet', '200mg', 'Ibuprofen', 'Square Pharmaceuticals'),
('Diclofen', 'Tablet', '50mg', 'Diclofenac Sodium', 'Beximco Pharmaceuticals'),
('Diclomax', 'Tablet', '50mg', 'Diclofenac Sodium', 'Ziska Pharmaceuticals'),
('Cataflam', 'Tablet', '50mg', 'Diclofenac Potassium', 'Novartis'),
('Dolorex', 'Gel', '5%', 'Diclofenac Gel', 'Incepta Pharmaceuticals'),
('Revodin', 'Gel', '1%', 'Diclofenac Diethylamine', 'Beximco Pharmaceuticals');

-- ============================================================
-- ANTIBIOTICS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Azithro', 'Capsule', '250mg', 'Azithromycin', 'Square Pharmaceuticals'),
('Azithrocin', 'Capsule', '500mg', 'Zithromycin', 'Beximco Pharmaceuticals'),
('Azimax', 'Capsule', '250mg', 'Azithromycin', 'Incepta Pharmaceuticals'),
('Zithrin', 'Capsule', '500mg', 'Azithromycin', 'Opsonin Pharma'),
('Azith', 'Suspension', '100mg/5ml', 'Azithromycin', 'Renata'),
('Cipra', 'Tablet', '250mg', 'Ciprofloxacin', 'Beximco Pharmaceuticals'),
('Ciplox', 'Tablet', '500mg', 'Ciprofloxacin', 'Incepta Pharmaceuticals'),
('Cipromycin', 'Tablet', '500mg', 'Ciprofloxacin', 'Square Pharmaceuticals'),
('Norflox', 'Tablet', '400mg', 'Norfloxacin', 'Opsonin Pharma'),
('Levoquin', 'Tablet', '250mg', 'Levofloxacin', 'Beximco Pharmaceuticals'),
('Levocin', 'Tablet', '500mg', 'Levofloxacin', 'Incepta Pharmaceuticals'),
('Lovox', 'Tablet', '500mg', 'Levofloxacin', 'Ziska Pharmaceuticals'),
('Moxifox', 'Tablet', '400mg', 'Moxifloxacin', 'Square Pharmaceuticals'),
('Nexin', 'Tablet', '200mg', 'Cefixime', 'Incepta Pharmaceuticals'),
('Cefstar', 'Capsule', '400mg', 'Cefixime', 'Beximco Pharmaceuticals'),
('Cefim', 'Capsule', '200mg', 'Cefixime', 'Ziska Pharmaceuticals'),
('Suprax', 'Capsule', '400mg', 'Cefixime', 'Sun Pharma'),
('Ceftin', 'Capsule', '300mg', 'Cefuroxime', 'GlaxoSmithKline'),
('Cefuzim', 'Capsule', '250mg', 'Cefuroxime', 'Incepta Pharmaceuticals'),
('Monotax', 'Injection', '1g', 'Ceftriaxone', 'Roche'),
('Monocef', 'Injection', '1g', 'Ceftriaxone', 'Opsonin Pharma'),
('Xone', 'Injection', '1g', 'Ceftriaxone', 'Ziska Pharmaceuticals'),
('Cefax', 'Injection', '500mg', 'Ceftriaxone', 'Beximco Pharmaceuticals'),
('Ampicillin', 'Capsule', '250mg', 'Ampicillin', 'Square Pharmaceuticals'),
('Amoxil', 'Capsule', '250mg', 'Amoxicillin', 'Beximco Pharmaceuticals'),
('Moxal', 'Capsule', '500mg', 'Amoxicillin', 'Incepta Pharmaceuticals'),
('Xclav', 'Capsule', '625mg', 'Amoxicillin+Clavulanic Acid', 'Beximco'),
('Augmentin', 'Capsule', '625mg', 'Amoxicillin+Clavulanic Acid', 'GSK'),
('Clavicin', 'Capsule', '375mg', 'Amoxicillin+Clavulanic Acid', 'Opsonin Pharma'),
('Duoclav', 'Capsule', '1g', 'Amoxicillin+Clavulanic Acid', 'Ziska Pharmaceuticals');

-- ============================================================
-- ANTIHISTAMINES
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Alatrol', 'Tablet', '25mg', 'Cyproheptadine', 'Beximco Pharmaceuticals'),
('Cynol', 'Tablet', '4mg', 'Cetirizine', 'Incepta Pharmaceuticals'),
('Allercet', 'Tablet', '10mg', 'Cetirizine', 'Square Pharmaceuticals'),
('Rincit', 'Tablet', '10mg', 'Cetirizine', 'Opsonin Pharma'),
('Zyrtec', 'Tablet', '10mg', 'Cetirizine', 'UCB'),
('Fenox', 'Tablet', '5mg', 'Fexofenadine', 'Beximco'),
('Hitom', 'Tablet', '10mg', 'Loratadine', 'Ziska Pharmaceuticals'),
('Claritine', 'Tablet', '10mg', 'Loratadine', 'Square Pharmaceuticals'),
('Lorat', 'Tablet', '10mg', 'Loratadine', 'Incepta Pharmaceuticals'),
('Deslo', 'Tablet', '5mg', 'Desloratadine', 'Beximco'),
('Deslor', 'Tablet', '5mg', 'Desloratadine', 'Opsonin Pharma'),
('Levocet', 'Tablet', '5mg', 'Levocetirizine', 'Incepta Pharmaceuticals');

-- ============================================================
-- GASTROINTESTINAL
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Omeprazole', 'Capsule', '20mg', 'Omeprazole', 'Beximco Pharmaceuticals'),
('Omez', 'Capsule', '20mg', 'Omeprazole', 'Incepta Pharmaceuticals'),
('Omesel', 'Capsule', '20mg', 'Omeprazole', 'Ziska Pharmaceuticals'),
('Losec', 'Capsule', '20mg', 'Omeprazole', 'AstraZeneca'),
('Pantocid', 'Tablet', '40mg', 'Pantoprazole', 'Beximco Pharmaceuticals'),
('Pansec', 'Tablet', '40mg', 'Pantoprazole', 'Opsonin Pharma'),
('Pantoril', 'Tablet', '20mg', 'Pantoprazole', 'Square Pharmaceuticals'),
('Pantex', 'Tablet', '40mg', 'Pantoprazole', 'Incepta Pharmaceuticals'),
('Nexium', 'Tablet', '20mg', 'Esomeprazole', 'AstraZeneca'),
('Esopel', 'Tablet', '20mg', 'Esomeprazole', 'Incepta Pharmaceuticals'),
('Esmolac', 'Tablet', '40mg', 'Esomeprazole', 'Opsonin Pharma'),
('Rabeplex', 'Tablet', '20mg', 'Rabeprazole', 'Ziska Pharmaceuticals'),
('Domperon', 'Tablet', '10mg', 'Domperidone', 'Beximco Pharmaceuticals'),
('Domstal', 'Tablet', '10mg', 'Domperidone', 'Incepta Pharmaceuticals'),
('Motilium', 'Tablet', '10mg', 'Domperidone', 'Johnson & Johnson'),
('Guttalax', 'Tablet', '5mg', 'Sodium Picosulfate', 'Sanofi'),
('Laxinorm', 'Tablet', '5mg', 'Sodium Picosulfate', 'Ziska'),
('Cremaffin', 'Suspension', '70%', 'Liquid Paraffin', 'Incepta Pharmaceuticals'),
('Esofin', 'Suspension', '34%', 'Magnesium Hydroxide', 'MST Pharma'),
('Alugel', 'Syrup', '400mg', 'Aluminium Hydroxide', 'Drug International'),
('Alumag', 'Suspension', '300mg/5ml', 'Aluminium Hydroxide', 'Opsonin'),
('Gelusil', 'Suspension', '300mg', 'Aluminium Hydroxide+Magnes', 'Pfizer'),
('Simecid', 'Capsule', '20mg', 'Famotidine', 'Beximco'),
('Famotac', 'Tablet', '20mg', 'Famotidine', 'Incepta Pharmaceuticals'),
('Famodine', 'Tablet', '40mg', 'Famotidine', 'Square Pharmaceuticals'),
('Ulcin', 'Capsule', '20mg', 'Famotidine', 'Opsonin Pharma');

-- ============================================================
-- ANTIDIABETIC
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Metformin', 'Tablet', '500mg', 'Metformin HCl', 'Beximco Pharmaceuticals'),
('Met', 'Tablet', '500mg', 'Metformin HCl', 'Incepta Pharmaceuticals'),
('Glucovas', 'Tablet', '500mg', 'Metformin HCl', 'Ziska Pharmaceuticals'),
('Glucon', 'Tablet', '850mg', 'Metformin HCl', 'Square Pharmaceuticals'),
('Metfire', 'Tablet', '1000mg', 'Metformin HCl', 'Opsonin Pharma'),
('Diabet', 'Tablet', '5mg', 'Glimepiride', 'Beximco Pharmaceuticals'),
('Glimy', 'Tablet', '2mg', 'Glimepiride', 'Incepta Pharmaceuticals'),
('Amaryl', 'Tablet', '4mg', 'Glimepiride', 'Sanofi'),
('Glimen', 'Tablet', '1mg', 'Glimepiride', 'Ziska Pharmaceuticals'),
('Glucotrol', 'Tablet', '80mg', 'Glipizide', 'Pfizer'),
('Minodiab', 'Tablet', '5mg', 'Glipizide', 'Sanofi'),
('Glive', 'Tablet', '100mg', 'Sitagliptin', 'Merck'),
('Sitagly', 'Tablet', '50mg', 'Sitagliptin', 'Incepta'),
('Januvia', 'Tablet', '100mg', 'Sitagliptin', 'Merck'),
('Vokan', 'Tablet', '50mg', 'Vildagliptin', 'Novartis'),
('Galvus', 'Tablet', '50mg', 'Vildagliptin', 'Novartis');

-- ============================================================
-- ANTIHYPERTENSIVE
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Amlodipine', 'Tablet', '5mg', 'Amlodipine', 'Beximco Pharmaceuticals'),
('Amlovas', 'Tablet', '5mg', 'Amlodipine', 'Incepta Pharmaceuticals'),
('Amlong', 'Tablet', '5mg', 'Amlodipine', 'Ziska Pharmaceuticals'),
('Norvasc', 'Tablet', '5mg', 'Amlodipine', 'Pfizer'),
('Amlip', 'Tablet', '2.5mg', 'Amlodipine', 'Opsonin Pharma'),
('Ladopa', 'Tablet', '50mg', 'Ladopa', 'Ziska Pharmaceuticals'),
('Losartan', 'Tablet', '50mg', 'Losartan Potassium', 'Beximco Pharmaceuticals'),
('Lostan', 'Tablet', '50mg', 'Losartan Potassium', 'Incepta Pharmaceuticals'),
('Losacar', 'Tablet', '50mg', 'Losartan', 'Opsonin Pharma'),
('Cozaar', 'Tablet', '50mg', 'Losartan', 'Merck'),
('Telsart', 'Tablet', '40mg', 'Telmisartan', 'Beximco'),
('Telsan', 'Tablet', '40mg', 'Telmisartan', 'Incepta'),
('Micardis', 'Tablet', '40mg', 'Telmisartan', 'Boehringer'),
('Telmikind', 'Tablet', '80mg', 'Telmisartan', 'Ziska'),
('Olmesan', 'Tablet', '20mg', 'Olmesartan', 'Ziska'),
('Olmetec', 'Tablet', '20mg', 'Olmesartan', 'Daiichi'),
('Verapamil', 'Tablet', '40mg', 'Verapamil HCl', 'Beximco'),
('Isoptin', 'Tablet', '40mg', 'Verapamil', 'Abbott'),
('Atenol', 'Tablet', '50mg', 'Atenolol', 'Incepta Pharmaceuticals'),
('Tenormin', 'Tablet', '50mg', 'Atenolol', 'Abbott'),
('Nebivol', 'Tablet', '5mg', 'Nebivolol', 'Incepta'),
('Nebilet', 'Tablet', '5mg', 'Nebivolol', 'Abbott'),
('Metoprol', 'Tablet', '50mg', 'Metoprolol Tartrate', 'Opsonin'),
('Lopressor', 'Tablet', '50mg', 'Metoprolol', 'Novartis'),
('Bisopral', 'Tablet', '5mg', 'Bisoprolol', 'Beximco'),
('Concor', 'Tablet', '5mg', 'Bisoprolol', 'Merck'),
('Carvedil', 'Tablet', '12.5mg', 'Carvedilol', 'Incepta'),
('Coreg', 'Tablet', '12.5mg', 'Carvedilol', 'GSK'),
('Doxazosin', 'Tablet', '4mg', 'Doxazosin', 'Ziska'),
('Doxacard', 'Tablet', '2mg', 'Doxazosin', 'Incepta');

-- ============================================================
-- CARDIAC
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Aspirin', 'Tablet', '75mg', 'Aspirin', 'Beximco Pharmaceuticals'),
('Ecotrin', 'Tablet', '325mg', 'Aspirin', 'Incepta Pharmaceuticals'),
('Atorva', 'Tablet', '10mg', 'Atorvastatin', 'Ziska Pharmaceuticals'),
('Atorlip', 'Tablet', '10mg', 'Atorvastatin', 'Square'),
('Lipitor', 'Tablet', '20mg', 'Atorvastatin', 'Pfizer'),
('Tornova', 'Tablet', '10mg', 'Atorvastatin', 'Incepta'),
('Rosub', 'Tablet', '10mg', 'Rosuvastatin', 'Beximco'),
('Crestor', 'Tablet', '10mg', 'Rosuvastatin', 'AstraZeneca'),
('Rosuva', 'Tablet', '5mg', 'Rosuvastatin', 'Incepta'),
('Simva', 'Tablet', '20mg', 'Simvastatin', 'Ziska'),
('Simvacor', 'Tablet', '20mg', 'Simvastatin', 'Opsonin'),
('Zocor', 'Tablet', '20mg', 'Simvastatin', 'Merck'),
('Nitroglycerin', 'Tablet', '0.5mg', 'Nitroglycerin', 'Merck'),
('Nitrostat', 'Tablet', '0.4mg', 'Nitroglycerin', 'Pfizer'),
('Isosorbide', 'Tablet', '20mg', 'Isosorbide Dinitrate', 'Incepta'),
('Monoket', 'Tablet', '20mg', 'Isosorbide Mononitrate', 'Ziska'),
('Imdur', 'Tablet', '30mg', 'Isosorbide Mononitrate', 'Schering'),
('Cordarone', 'Tablet', '200mg', 'Amiodarone', 'Sanofi'),
('Amidaron', 'Tablet', '200mg', 'Amiodarone', 'Incepta'),
('Digoxin', 'Tablet', '0.25mg', 'Digoxin', 'Beximco'),
('Lanoxin', 'Tablet', '0.25mg', 'Digoxin', 'Pfizer'),
('Coumadin', 'Tablet', '5mg', 'Warfarin', 'BMS'),
('Warf', 'Tablet', '5mg', 'Warfarin', 'Incepta'),
('Clopidogrel', 'Tablet', '75mg', 'Clopidogrel', 'Beximco'),
('Plavix', 'Tablet', '75mg', 'Clopidogrel', 'Sanofi'),
('Clordip', 'Tablet', '75mg', 'Clopidogrel', 'Square');

-- ============================================================
-- CNS DRUGS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Amitriptyline', 'Tablet', '25mg', 'Amitriptyline', 'Opsonin Pharma'),
('Tryptomer', 'Tablet', '25mg', 'Amitriptyline', 'Merck'),
('Doxepin', 'Capsule', '25mg', 'Doxepin', 'Incepta'),
('Fluoxetine', 'Capsule', '20mg', 'Fluoxetine', 'Beximco Pharmaceuticals'),
('Flunil', 'Capsule', '20mg', 'Fluoxetine', 'Incepta'),
('Prozac', 'Capsule', '20mg', 'Fluoxetine', 'Eli Lilly'),
('Escitalop', 'Tablet', '10mg', 'Escitalopram', 'Incepta'),
('Cipralex', 'Tablet', '10mg', 'Escitalopram', 'Lundbeck'),
('Citalopram', 'Tablet', '20mg', 'Citalopram', 'Ziska'),
('Sertraline', 'Tablet', '50mg', 'Sertraline', 'Incepta'),
('Serlift', 'Tablet', '50mg', 'Sertraline', 'Ziska'),
('Zoloft', 'Tablet', '50mg', 'Sertraline', 'Pfizer'),
('Paroxetine', 'Tablet', '20mg', 'Paroxetine', 'Incepta'),
('Paxil', 'Tablet', '20mg', 'Paroxetine', 'GSK'),
('Diazepam', 'Tablet', '5mg', 'Diazepam', 'Beximco'),
('Alzolam', 'Tablet', '0.5mg', 'Alprazolam', 'Incepta'),
('Xanax', 'Tablet', '0.5mg', 'Alprazolam', 'Pfizer'),
('Clonazepam', 'Tablet', '0.5mg', 'Clonazepam', 'Incepta'),
('Rivotril', 'Tablet', '0.5mg', 'Clonazepam', 'Roche'),
('Phenytoin', 'Capsule', '100mg', 'Phenytoin Sodium', 'Beximco'),
('Dilantin', 'Capsule', '100mg', 'Phenytoin', 'Pfizer'),
('Carbamazepine', 'Tablet', '200mg', 'Carbamazepine', 'Opsonin'),
('Tegretol', 'Tablet', '200mg', 'Carbamazepine', 'Novartis'),
('Valproic Acid', 'Syrup', '200mg/5ml', 'Valproic Acid', 'Incepta'),
('Epilene', 'Syrup', '200mg/5ml', 'Valproic Acid', 'Ziska'),
('Levocet', 'Tablet', '250mg', 'Levetiracetam', 'UCB'),
('Keppra', 'Tablet', '500mg', 'Levetiracetam', 'UCB'),
('Sodium Valproate', 'Tablet', '200mg', 'Sodium Valproate', 'Incepta');

-- ============================================================
-- RESPIRATORY
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Salbutamol', 'Inhaler', '100mcg', 'Salbutamol', 'Beximco'),
('Ventolin', 'Inhaler', '100mcg', 'Salbutamol', 'GSK'),
('Asthalin', 'Inhaler', '100mcg', 'Salbutamol', 'Incepta'),
('Salbutamol', 'Syrup', '2mg/5ml', 'Salbutamol', 'Beximco'),
('Deriphyllin', 'Tablet', '150mg', 'Theophylline', 'Ziska'),
('Theophylline', 'Tablet', '100mg', 'Theophylline', 'Incepta'),
('Ambine', 'Tablet', '4mg', 'Bambuterol', 'Ziska'),
('Bambec', 'Tablet', '10mg', 'Bambuterol', 'AstraZeneca'),
('Montelukast', 'Tablet', '10mg', 'Montelukast', 'Beximco'),
('Monteem', 'Tablet', '10mg', 'Montelukast', 'Incepta'),
('Singulair', 'Tablet', '10mg', 'Montelukast', 'Merck'),
('Allegra', 'Tablet', '180mg', 'Fexofenadine', 'Sanofi'),
('Cetirizine', 'Tablet', '10mg', 'Cetirizine', 'Incepta'),
('Xyzal', 'Tablet', '5mg', 'Levocetirizine', 'UCB'),
('Benadryl', 'Syrup', '12.5mg/5ml', 'Diphenhydramine', 'J&J'),
('Phensedyl', 'Syrup', '12.5mg/5ml', 'Diphenhydramine', 'Pharmacia'),
('Codopa', 'Syrup', '2.5mg/5ml', 'Pholcodine', 'Ziska'),
('Benadryl', 'Cough', '12.5mg/5ml', 'Diphenhydramine', 'J&J'),
('Ascoril', 'Syrup', '2mg/5ml', 'Ambroxol', 'Incepta'),
('Mucosol', 'Syrup', '15mg/5ml', 'Ambroxol', 'Beximco'),
('Mucinex', 'Syrup', '30mg/5ml', 'Guaifenesin', 'Pfizer'),
('Carbocisteine', 'Syrup', '250mg/5ml', 'Carbocisteine', 'Ziska'),
('Kestine', 'Tablet', '10mg', 'Ebastine', 'Incepta'),
('Levogen', 'Tablet', '5mg', 'Levocetirizine', 'Ziska');

-- ============================================================
-- STEROIDS & HORMONES
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Prednisolone', 'Tablet', '5mg', 'Prednisolone', 'Beximco'),
('Prednisone', 'Tablet', '10mg', 'Prednisone', 'Incepta'),
('Deltasone', 'Tablet', '5mg', 'Prednisone', 'Pfizer'),
('Wysolone', 'Tablet', '5mg', 'Prednisolone', 'Wyeth'),
('Hydrocort', 'Injection', '100mg', 'Hydrocortisone', 'Pfizer'),
('Dexona', 'Injection', '4mg', 'Dexamethasone', 'Ziska'),
('Decadron', 'Injection', '4mg', 'Dexamethasone', 'Merck'),
('Betamethasone', 'Cream', '0.1%', 'Betamethasone', 'Incepta'),
('Topicort', 'Cream', '0.05%', 'Clobetasol', 'Ziska'),
('Taclonex', 'Cream', '0.05%', 'Clobetasol', 'BMS'),
('Desonide', 'Cream', '0.05%', 'Desonide', 'Incepta'),
('Desowen', 'Cream', '0.05%', 'Desonide', 'MSD'),
('Thyroxine', 'Tablet', '50mcg', 'Levothyroxine', 'Beximco'),
('Thyronorm', 'Tablet', '50mcg', 'Levothyroxine', 'Incepta'),
('Eltroxin', 'Tablet', '50mcg', 'Levothyroxine', 'GSK'),
('Methimazole', 'Tablet', '10mg', 'Methimazole', 'Incepta'),
('Carbimazole', 'Tablet', '5mg', 'Carbimazole', 'Ziska'),
('Glucocorticoid', 'Injection', '4mg', 'Methylprednisolone', 'Pfizer'),
('Solu-Medrol', 'Injection', '40mg', 'Methylprednisolone', 'Pfizer'),
('Depo-Medrol', 'Injection', '40mg', 'Methylprednisolone', 'Pfizer');

-- ============================================================
-- ANTI-ALLERGIC
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Loratadine', 'Tablet', '10mg', 'Loratadine', 'Incepta'),
('Loramine', 'Tablet', '10mg', 'Loratadine', 'Ziska'),
('Claritine', 'Tablet', '10mg', 'Loratadine', 'Bayer'),
('Cetirizine', 'Tablet', '10mg', 'Cetirizine', 'Incepta'),
('Citiriz', 'Tablet', '10mg', 'Cetirizine', 'Ziska'),
('Zyrtec', 'Tablet', '10mg', 'Cetirizine', 'UCB'),
('Fexofenadine', 'Tablet', '120mg', 'Fexofenadine', 'Incepta'),
('Allegra', 'Tablet', '120mg', 'Fexofenadine', 'Sanofi'),
('Desloratadine', 'Tablet', '5mg', 'Desloratadine', 'Incepta'),
('Deslotin', 'Tablet', '5mg', 'Desloratadine', 'Ziska'),
('Neoclar', 'Tablet', '10mg', 'Mizolastine', 'Ziska'),
('Mizollen', 'Tablet', '10mg', 'Mizolastine', 'Bayer');

-- ============================================================
-- ANTI-VIRAL & ANTI-HIV
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Acyclovir', 'Tablet', '200mg', 'Acyclovir', 'Beximco'),
('Zovirax', 'Tablet', '200mg', 'Acyclovir', 'GlaxoSmithKline'),
('Valacyclovir', 'Tablet', '500mg', 'Valacyclovir', 'Incepta'),
('Valtrex', 'Tablet', '500mg', 'Valacyclovir', 'GSK'),
('Famciclovir', 'Tablet', '250mg', 'Famciclovir', 'Incepta'),
('Famvir', 'Tablet', '250mg', 'Famciclovir', 'Novartis'),
('Oseltamivir', 'Capsule', '75mg', 'Oseltamivir', 'Roche'),
('Tamiflu', 'Capsule', '75mg', 'Oseltamivir', 'Roche'),
('Ribavirin', 'Capsule', '200mg', 'Ribavirin', 'Incepta'),
('Copegus', 'Capsule', '200mg', 'Ribavirin', 'Roche'),
('Lamivudine', 'Tablet', '100mg', 'Lamivudine', 'GSK'),
('Zeffix', 'Tablet', '100mg', 'Lamivudine', 'GSK'),
('Tenofovir', 'Tablet', '300mg', 'Tenofovir', 'Gilead'),
('Viread', 'Tablet', '300mg', 'Tenofovir', 'Gilead'),
('Atripla', 'Tablet', '600mg', 'Tenofovir+Emtricitabine', 'Gilead'),
('Dovato', 'Tablet', '50mg', 'Dolutegravir', 'GSK');

-- ============================================================
-- ANTI-CANCER
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Methotrexate', 'Tablet', '2.5mg', 'Methotrexate', 'Incepta'),
('Trexall', 'Tablet', '2.5mg', 'Methotrexate', 'Pfizer'),
('Cyclophosphamide', 'Injection', '200mg', 'Cyclophosphamide', 'Baxter'),
('Cycloxan', 'Injection', '500mg', 'Cyclophosphamide', 'Ziska'),
('5-Fluorouracil', 'Injection', '500mg', '5-Fluorouracil', 'Roche'),
('Fluoroject', 'Injection', '500mg', '5-Fluorouracil', 'Incepta'),
('Doxorubicin', 'Injection', '50mg', 'Doxorubicin', 'Pfizer'),
('Adriblastin', 'Injection', '50mg', 'Doxorubicin', 'Pfizer'),
('Cisplatin', 'Injection', '50mg', 'Cisplatin', 'Bristol'),
('Platamine', 'Injection', '50mg', 'Cisplatin', 'Incepta'),
('Carboplatin', 'Injection', '150mg', 'Carboplatin', 'Bristol'),
('Paraplatin', 'Injection', '150mg', 'Carboplatin', 'Ziska'),
('Paclitaxel', 'Injection', '100mg', 'Paclitaxel', 'Bristol'),
('Onxol', 'Injection', '100mg', 'Paclitaxel', 'Incepta'),
('Gemcitabine', 'Injection', '200mg', 'Gemcitabine', 'Eli Lilly'),
('Gemzar', 'Injection', '200mg', 'Gemcitabine', 'Eli Lilly'),
('Imatinib', 'Capsule', '100mg', 'Imatinib', 'Novartis'),
('Glivec', 'Capsule', '100mg', 'Imatinib', 'Novartis'),
('Erlotinib', 'Tablet', '150mg', 'Erlotinib', 'Roche'),
('Tarceva', 'Tablet', '150mg', 'Erlotinib', 'Roche'),
('Sunitinib', 'Capsule', '50mg', 'Sunitinib', 'Pfizer'),
('Sutent', 'Capsule', '50mg', 'Sunitinib', 'Pfizer'),
('Pazopanib', 'Tablet', '400mg', 'Pazopanib', 'GSK'),
('Votrient', 'Tablet', '400mg', 'Pazopanib', 'GSK');

-- ============================================================
-- VITAMINS & SUPPLEMENTS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Becosules', 'Capsule', '5000IU', 'Vitamin B Complex', 'Incepta'),
('Neurobion', 'Capsule', '5000IU', 'Vitamin B Complex', 'Merck'),
('Neuroforte', 'Capsule', '100mg', 'Vitamin B Complex', 'Ziska'),
('Multivite', 'Syrup', '100ml', 'Multivitamin', 'Beximco'),
('A, D', 'Capsule', '50000IU', 'Vitamin A+D', 'Incepta'),
('Vitamin D', 'Capsule', '60000IU', 'Cholecalciferol', 'Ziska'),
('Calcirol', 'Capsule', '60000IU', 'Cholecalciferol', 'Incepta'),
('D-Rise', 'Capsule', '60000IU', 'Cholecalciferol', 'Opsonin'),
('Calcium', 'Tablet', '500mg', 'Calcium Carbonate', 'Incepta'),
('Cacit', 'Tablet', '500mg', 'Calcium Carbonate', 'Warner'),
('Shelcal', 'Tablet', '500mg', 'Calcium Carbonate', 'Elder'),
('Osteocare', 'Tablet', '500mg', 'Calcium Carbonate', 'Incepta'),
('Ferric', 'Syrup', '200mg/5ml', 'Ferrous Sulfate', 'Incepta'),
('Ferrous Sulfate', 'Tablet', '200mg', 'Ferrous Sulfate', 'Beximco'),
('Fefol', 'Capsule', '300mg', 'Ferrous Sulfate+Folate', 'Incepta'),
('Ferrocal', 'Capsule', '300mg', 'Ferrous Sulfate+Calcium', 'Ziska'),
('Ferroplex', 'Syrup', '100ml', 'Ferrous Sulfate', 'GSK'),
('Iron Dextran', 'Injection', '100mg', 'Iron Dextran', 'Baxter'),
('Folic Acid', 'Tablet', '5mg', 'Folic Acid', 'Incepta'),
('Folinic Acid', 'Tablet', '15mg', 'Folinic Acid', 'Pfizer'),
('Vitamin B12', 'Injection', '1000mcg', 'Cyanocobalamin', 'Incepta'),
('Cobalamin', 'Injection', '1000mcg', 'Cyanocobalamin', 'Ziska'),
('Mecobalamin', 'Tablet', '500mcg', 'Mecobalamin', 'Incepta'),
('Neurokind', 'Tablet', '500mcg', 'Mecobalamin', 'Ziska'),
('Thiamine', 'Tablet', '100mg', 'Thiamine HCl', 'Incepta'),
('Vitamin B1', 'Tablet', '100mg', 'Thiamine', 'Beximco'),
('Pyridoxine', 'Tablet', '25mg', 'Pyridoxine', 'Incepta'),
('Nicotinamide', 'Tablet', '100mg', 'Nicotinamide', 'Incepta'),
('Ascorbic Acid', 'Tablet', '500mg', 'Ascorbic Acid', 'Incepta'),
('Vitamin C', 'Tablet', '500mg', 'Ascorbic Acid', 'Beximco'),
('Cecon', 'Capsule', '500mg', 'Ascorbic Acid', 'Wyeth'),
('Alpha Lipoic Acid', 'Capsule', '300mg', 'Alpha Lipoic Acid', 'Incepta'),
('Tioctral', 'Capsule', '300mg', 'Alpha Lipoic Acid', 'Ziska'),
('Zinc Sulfate', 'Tablet', '220mg', 'Zinc Sulfate', 'Incepta'),
('Zincov', 'Tablet', '220mg', 'Zinc Sulfate', 'Ziska'),
('Zincron', 'Syrup', '20mg/5ml', 'Zinc Sulfate', 'Incepta'),
('Lysine', 'Syrup', '200mg/5ml', 'Lysine', 'Incepta'),
('Lysine', 'Tablet', '500mg', 'Lysine', 'Incepta');

-- ============================================================
-- MUSCLE RELAXANTS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Baclofen', 'Tablet', '10mg', 'Baclofen', 'Incepta'),
('Lioresal', 'Tablet', '10mg', 'Baclofen', 'Novartis'),
('Tizanidine', 'Tablet', '2mg', 'Tizanidine', 'Incepta'),
('Sirdalud', 'Tablet', '4mg', 'Tizanidine', 'Novartis'),
('Cyclobenzaprine', 'Tablet', '10mg', 'Cyclobenzaprine', 'Incepta'),
('Flexeril', 'Tablet', '10mg', 'Cyclobenzaprine', 'Merck'),
('Carisoprodol', 'Tablet', '350mg', 'Carisoprodol', 'Incepta'),
('Soma', 'Tablet', '350mg', 'Carisoprodol', 'Pfizer'),
('Metaxalone', 'Tablet', '800mg', 'Metaxalone', 'Incepta'),
('Skelaxin', 'Tablet', '800mg', 'Metaxalone', 'King');

-- ============================================================
-- ANTI-EPILEPTICS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Phenytoin', 'Capsule', '100mg', 'Phenytoin', 'Beximco'),
('Dilantin', 'Capsule', '100mg', 'Phenytoin', 'Pfizer'),
('Carbamazepine', 'Tablet', '200mg', 'Carbamazepine', 'Incepta'),
('Tegretol', 'Tablet', '200mg', 'Carbamazepine', 'Novartis'),
('Oxcarbazepine', 'Tablet', '300mg', 'Oxcarbazepine', 'Incepta'),
('Trileptal', 'Tablet', '300mg', 'Oxcarbazepine', 'Novartis'),
('Levetiracetam', 'Tablet', '500mg', 'Levetiracetam', 'Incepta'),
('Keppra', 'Tablet', '500mg', 'Levetiracetam', 'UCB'),
('Topiramate', 'Tablet', '25mg', 'Topiramate', 'Incepta'),
('Topamax', 'Tablet', '25mg', 'Topiramate', 'J&J'),
('Lamotrigine', 'Tablet', '50mg', 'Lamotrigine', 'Incepta'),
('Lamictal', 'Tablet', '50mg', 'Lamotrigine', 'GSK'),
('Gabapentin', 'Capsule', '300mg', 'Gabapentin', 'Incepta'),
('Neurontin', 'Capsule', '300mg', 'Gabapentin', 'Pfizer'),
('Pregabalin', 'Capsule', '75mg', 'Pregabalin', 'Incepta'),
('Lyrica', 'Capsule', '75mg', 'Pregabalin', 'Pfizer'),
('Sodium Valproate', 'Tablet', '200mg', 'Sodium Valproate', 'Incepta'),
('Epilene', 'Syrup', '200mg/5ml', 'Sodium Valproate', 'Ziska');

-- ============================================================
-- ANTIDEPRESSANTS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Amitriptyline', 'Tablet', '25mg', 'Amitriptyline', 'Incepta'),
('Tryptomer', 'Tablet', '25mg', 'Amitriptyline', 'Merck'),
('Imipramine', 'Tablet', '25mg', 'Imipramine', 'Incepta'),
('Tofranil', 'Tablet', '25mg', 'Imipramine', 'Novartis'),
('Clomipramine', 'Tablet', '25mg', 'Clomipramine', 'Incepta'),
('Anafranil', 'Tablet', '25mg', 'Clomipramine', 'Novartis'),
('Fluoxetine', 'Capsule', '20mg', 'Fluoxetine', 'Incepta'),
('Prozac', 'Capsule', '20mg', 'Fluoxetine', 'Eli Lilly'),
('Paroxetine', 'Tablet', '20mg', 'Paroxetine', 'Incepta'),
('Paxil', 'Tablet', '20mg', 'Paroxetine', 'GSK'),
('Sertraline', 'Tablet', '50mg', 'Sertraline', 'Incepta'),
('Zoloft', 'Tablet', '50mg', 'Sertraline', 'Pfizer'),
('Escitalopram', 'Tablet', '10mg', 'Escitalopram', 'Incepta'),
('Cipralex', 'Tablet', '10mg', 'Escitalopram', 'Lundbeck'),
('Venlafaxine', 'Tablet', '75mg', 'Venlafaxine', 'Incepta'),
('Effexor', 'Tablet', '75mg', 'Venlafaxine', 'Wyeth'),
('Duloxetine', 'Capsule', '30mg', 'Duloxetine', 'Incepta'),
('Cymbalta', 'Capsule', '30mg', 'Duloxetine', 'Eli Lilly'),
('Mirtazapine', 'Tablet', '15mg', 'Mirtazapine', 'Incepta'),
('Remeron', 'Tablet', '15mg', 'Mirtazapine', 'MSD'),
('Bupropion', 'Tablet', '150mg', 'Bupropion', 'Incepta'),
('Wellbutrin', 'Tablet', '150mg', 'Bupropion', 'GSK'),
('Trazodone', 'Tablet', '50mg', 'Trazodone', 'Incepta'),
('Desyrel', 'Tablet', '50mg', 'Trazodone', 'Pfizer');

-- ============================================================
-- ANTI-PSYCHOTICS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Haloperidol', 'Tablet', '5mg', 'Haloperidol', 'Incepta'),
('Haldol', 'Tablet', '5mg', 'Haloperidol', 'J&J'),
('Risperidone', 'Tablet', '2mg', 'Risperidone', 'Incepta'),
('Risperdal', 'Tablet', '2mg', 'Risperidone', 'J&J'),
('Quetiapine', 'Tablet', '25mg', 'Quetiapine', 'Incepta'),
('Seroquel', 'Tablet', '25mg', 'Quetiapine', 'AstraZeneca'),
('Olanzapine', 'Tablet', '5mg', 'Olanzapine', 'Incepta'),
('Zyprexa', 'Tablet', '5mg', 'Olanzapine', 'Eli Lilly'),
('Aripiprazole', 'Tablet', '10mg', 'Aripiprazole', 'Incepta'),
('Abilify', 'Tablet', '10mg', 'Aripiprazole', 'Otsuka'),
('Clozapine', 'Tablet', '100mg', 'Clozapine', 'Incepta'),
('Clozaril', 'Tablet', '100mg', 'Clozapine', 'Novartis'),
('Ziprasidone', 'Tablet', '20mg', 'Ziprasidone', 'Incepta'),
('Geodon', 'Tablet', '20mg', 'Ziprasidone', 'Pfizer'),
('Ziprasidone', 'Tablet', '40mg', 'Ziprasidone', 'Pfizer'),
('Paliperidone', 'Tablet', '3mg', 'Paliperidone', 'Incepta'),
('Invega', 'Tablet', '3mg', 'Paliperidone', 'J&J');

-- ============================================================
-- OPHTHALMIC
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Timolol', 'Eye Drops', '0.5%', 'Timolol', 'Incepta'),
('Timoptic', 'Eye Drops', '0.5%', 'Timolol', 'Bausch'),
('Xalatan', 'Eye Drops', '0.005%', 'Latanoprost', 'Pfizer'),
('Latanoprost', 'Eye Drops', '0.005%', 'Latanoprost', 'Incepta'),
('Lumigan', 'Eye Drops', '0.03%', 'Bimatoprost', 'Allergan'),
('Bimatoprost', 'Eye Drops', '0.03%', 'Bimatoprost', 'Incepta'),
('Combigan', 'Eye Drops', '0.5%', 'Brimonidine+Timolol', 'Allergan'),
('Azopt', 'Eye Drops', '1%', 'Brinzolamide', 'Alcon'),
('Trusopt', 'Eye Drops', '2%', 'Dorzolamide', 'MSD'),
('Nevanac', 'Eye Drops', '0.1%', 'Nepafenac', 'Alcon'),
('Dexamol', 'Eye Drops', '0.1%', 'Dexamethasone', 'Incepta'),
('Maxidex', 'Eye Drops', '0.1%', 'Dexamethasone', 'Alcon'),
('Tobradex', 'Eye Drops', '0.3%', 'Tobramycin+Dexamethasone', 'Alcon'),
('Tobramycin', 'Eye Drops', '0.3%', 'Tobramycin', 'Incepta'),
('Ciprofloxacin', 'Eye Drops', '0.3%', 'Ciprofloxacin', 'Incepta'),
('Ciloxan', 'Eye Drops', '0.3%', 'Ciprofloxacin', 'Alcon'),
('Moxifloxacin', 'Eye Drops', '0.5%', 'Moxifloxacin', 'Incepta'),
('Vigamox', 'Eye Drops', '0.5%', 'Moxifloxacin', 'Alcon'),
('Ofloxacin', 'Eye Drops', '0.3%', 'Ofloxacin', 'Incepta'),
('Ocuflox', 'Eye Drops', '0.3%', 'Ofloxacin', 'Allergan'),
('Refresh Tears', 'Eye Drops', '0.5%', 'Carboxymethylcellulose', 'Allergan'),
('Thera Tears', 'Eye Drops', '0.5%', 'Carboxymethylcellulose', 'Akorn'),
('Refresh Plus', 'Eye Drops', '0.5%', 'Carboxymethylcellulose', 'Allergan');

-- ============================================================
-- EAR & NASAL
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Ciprodex', 'Ear Drops', '0.3%', 'Ciprofloxacin+Dexamethasone', 'Alcon'),
('Otiniva', 'Ear Drops', '0.3%', 'Ciprofloxacin+Dexamethasone', 'Incepta'),
('Naftin', 'Ear Drops', '0.02%', 'Naftifine', 'Bayer'),
('Xylocaine', 'Ear Drops', '2%', 'Lignocaine', 'Fresenius'),
('Sofradex', 'Ear Drops', '0.5%', 'Framycetin+Dexamethasone', 'Sanofi'),
('Sodium Bicarbonate', 'Ear Drops', '3%', 'Sodium Bicarbonate', 'Incepta'),
('Clarix', 'Nasal Spray', '0.1%', 'Xylometazoline', 'Incepta'),
('Otrivin', 'Nasal Spray', '0.1%', 'Xylometazoline', 'Novartis'),
('Nasivion', 'Nasal Spray', '0.05%', 'Oxymetazoline', 'Bayer'),
('Sinex', 'Nasal Spray', '0.05%', 'Oxymetazoline', 'Incepta'),
('Avamys', 'Nasal Spray', '27.5mcg', 'Fluticasone Furoate', 'GSK'),
('Flixonase', 'Nasal Spray', '50mcg', 'Fluticasone Propionate', 'GSK'),
('Nazonex', 'Nasal Spray', '50mcg', 'Mometasone', 'MSD'),
('Rhinocort', 'Nasal Spray', '32mcg', 'Budesonide', 'AstraZeneca'),
('Montelukast', 'Nasal Spray', '10mg', 'Montelukast', 'Incepta'),
('Saline', 'Nasal Drops', '0.9%', 'Sodium Chloride', 'Incepta');

-- ============================================================
-- dermatological
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Hydroquinone', 'Cream', '4%', 'Hydroquinone', 'Incepta'),
('Melano', 'Cream', '4%', 'Hydroquinone', 'Ziska'),
('Tretinoin', 'Cream', '0.05%', 'Tretinoin', 'Incepta'),
('Retin-A', 'Cream', '0.05%', 'Tretinoin', 'J&J'),
('Adapalene', 'Gel', '0.1%', 'Adapalene', 'Incepta'),
('Differin', 'Gel', '0.1%', 'Adapalene', 'Galderma'),
('Benzac', 'Gel', '2.5%', 'Benzoyl Peroxide', 'Galderma'),
('Benzoyl Peroxide', 'Gel', '2.5%', 'Benzoyl Peroxide', 'Incepta'),
('Clindamycin', 'Gel', '1%', 'Clindamycin', 'Incepta'),
('Dalacin', 'Gel', '1%', 'Clindamycin', 'Pfizer'),
('Erythromycin', 'Gel', '2%', 'Erythromycin', 'Incepta'),
('Tetracycline', 'Gel', '3%', 'Tetracycline', 'Incepta'),
('Mupirocin', 'Ointment', '2%', 'Mupirocin', 'Incepta'),
('Bactroban', 'Ointment', '2%', 'Mupirocin', 'GSK'),
('Fucidin', 'Ointment', '2%', 'Fusidic Acid', 'Leo Pharma'),
('Fusidic Acid', 'Ointment', '2%', 'Fusidic Acid', 'Incepta'),
('Silver Sulfadiazine', 'Cream', '1%', 'Silver Sulfadiazine', 'Incepta'),
('Silvene', 'Cream', '1%', 'Silver Sulfadiazine', 'Ziska'),
('Clobetasol', 'Cream', '0.05%', 'Clobetasol', 'Incepta'),
('Dermovate', 'Cream', '0.05%', 'Clobetasol', 'Galderma'),
('Betamethasone', 'Cream', '0.1%', 'Betamethasone', 'Incepta'),
('Diprolene', 'Cream', '0.05%', 'Betamethasone', 'MSD'),
('Mometasone', 'Cream', '0.1%', 'Mometasone', 'Incepta'),
('Elocon', 'Cream', '0.1%', 'Mometasone', 'MSD'),
('Triamcinolone', 'Cream', '0.1%', 'Triamcinolone', 'Incepta'),
('Kenalog', 'Cream', '0.1%', 'Triamcinolone', 'Bristol'),
('Salicylic Acid', 'Gel', '3%', 'Salicylic Acid', 'Incepta'),
('Imiquimod', 'Cream', '5%', 'Imiquimod', 'Incepta'),
('Aldara', 'Cream', '5%', 'Imiquimod', '3M'),
('Pimecrolimus', 'Cream', '1%', 'Pimecrolimus', 'Incepta'),
('Elidel', 'Cream', '1%', 'Pimecrolimus', 'Novartis'),
('Tacrolimus', 'Ointment', '0.1%', 'Tacrolimus', 'Incepta'),
('Protopic', 'Ointment', '0.1%', 'Tacrolimus', 'Astellas'),
('Acyclovir', 'Cream', '5%', 'Acyclovir', 'Incepta'),
('Zovirax', 'Cream', '5%', 'Acyclovir', 'GSK'),
('Penciclovir', 'Cream', '1%', 'Penciclovir', 'Incepta'),
('Denavir', 'Cream', '1%', 'Penciclovir', 'Novartis'),
('Terbinafine', 'Cream', '1%', 'Terbinafine', 'Incepta'),
('Lamisil', 'Cream', '1%', 'Terbinafine', 'Novartis'),
('Clotrimazole', 'Cream', '1%', 'Clotrimazole', 'Incepta'),
('Canesten', 'Cream', '1%', 'Clotrimazole', 'Bayer'),
('Miconazole', 'Cream', '2%', 'Miconazole', 'Incepta'),
('Daktarin', 'Cream', '2%', 'Miconazole', 'J&J'),
('Econazole', 'Cream', '1%', 'Econazole', 'Incepta'),
(' Ecostatin', 'Cream', '1%', 'Econazole', 'Bayer'),
('Sertaconazole', 'Cream', '2%', 'Sertaconazole', 'Incepta'),
('Dermovate', 'Cream', '0.05%', 'Clobetasol', 'Galderma');

-- ============================================================
-- ANTIFUNGALS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Fluconazole', 'Capsule', '150mg', 'Fluconazole', 'Incepta'),
('Diflucan', 'Capsule', '150mg', 'Fluconazole', 'Pfizer'),
('Flucos', 'Capsule', '100mg', 'Fluconazole', 'Ziska'),
('Itraconazole', 'Capsule', '100mg', 'Itraconazole', 'Incepta'),
('Sporanox', 'Capsule', '100mg', 'Itraconazole', 'Janssen'),
('Voriconazole', 'Tablet', '200mg', 'Voriconazole', 'Pfizer'),
('Vfend', 'Tablet', '200mg', 'Voriconazole', 'Pfizer'),
('Nystatin', 'Syrup', '100000IU/ml', 'Nystatin', 'Incepta'),
('Mycostatin', 'Syrup', '100000IU/ml', 'Nystatin', 'Bristol'),
('Griseofulvin', 'Tablet', '250mg', 'Griseofulvin', 'Incepta'),
('Grisovin', 'Tablet', '250mg', 'Griseofulvin', 'GSK'),
('Terbinafine', 'Tablet', '250mg', 'Terbinafine', 'Incepta'),
('Lamisil', 'Tablet', '250mg', 'Terbinafine', 'Novartis'),
('Ketoconazole', 'Shampoo', '2%', 'Ketoconazole', 'Incepta'),
('Nizoral', 'Shampoo', '2%', 'Ketoconazole', 'J&J'),
('Clotrimazole', 'Vaginal Tablet', '100mg', 'Clotrimazole', 'Incepta'),
('Canesten', 'Vaginal Tablet', '100mg', 'Clotrimazole', 'Bayer'),
('Miconazole', 'Vaginal Cream', '2%', 'Miconazole', 'Incepta'),
('Daktarin', 'Vaginal Cream', '2%', 'Miconazole', 'J&J'),
('Fenticlar', 'Vaginal Tablet', '150mg', 'Fenticonazole', 'Incepta'),
('Fenticonazole', 'Vaginal Tablet', '150mg', 'Fenticonazole', 'Incepta');

-- ============================================================
-- ANTI-TUBERCULOSIS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Isoniazid', 'Tablet', '100mg', 'Isoniazid', 'Beximco'),
('INH', 'Tablet', '100mg', 'Isoniazid', 'Incepta'),
('Rifampicin', 'Capsule', '300mg', 'Rifampicin', 'Beximco'),
('Rifampin', 'Capsule', '300mg', 'Rifampicin', 'Incepta'),
('Ethambutol', 'Tablet', '400mg', 'Ethambutol', 'Incepta'),
('Myambutol', 'Tablet', '400mg', 'Ethambutol', 'Daiichi'),
('Pyrazinamide', 'Tablet', '500mg', 'Pyrazinamide', 'Incepta'),
('PZA', 'Tablet', '500mg', 'Pyrazinamide', 'Incepta'),
('Streptomycin', 'Injection', '1g', 'Streptomycin', 'Incepta'),
('Kanamycin', 'Injection', '500mg', 'Kanamycin', 'Incepta'),
('Amikacin', 'Injection', '500mg', 'Amikacin', 'Bristol'),
('Ethionamide', 'Tablet', '250mg', 'Ethionamide', 'Incepta'),
('Cycloserine', 'Capsule', '250mg', 'Cycloserine', 'Incepta'),
('PAS', 'Tablet', '500mg', 'Aminosalicylic Acid', 'Incepta'),
('Rifabutin', 'Capsule', '150mg', 'Rifabutin', 'Incepta'),
('Rifapentine', 'Tablet', '150mg', 'Rifapentine', 'Incepta');

-- ============================================================
-- CONTRACEPTIVES
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Microgynon', 'Tablet', '0.03mg', 'Ethinylestradiol+Levonorgestrel', 'Bayer'),
('Lovelle', 'Tablet', '0.03mg', 'Ethinylestradiol+Levonorgestrel', 'Incepta'),
('Desogestrel', 'Tablet', '0.075mg', 'Desogestrel', 'Incepta'),
('Cerazette', 'Tablet', '0.075mg', 'Desogestrel', 'MSD'),
('Yasmin', 'Tablet', '0.03mg', 'Drospirenone+Ethinylestradiol', 'Bayer'),
('Yaz', 'Tablet', '0.02mg', 'Drospirenone+Ethinylestradiol', 'Bayer'),
('Marvelon', 'Tablet', '0.03mg', 'Desogestrel+Ethinylestradiol', 'MSD'),
('Diane', 'Tablet', '0.035mg', 'Cyproterone+Ethinylestradiol', 'Bayer'),
('Gynera', 'Tablet', '0.03mg', 'Gestodene+Ethinylestradiol', 'Bayer'),
('Cipmista', 'Tablet', '0.03mg', 'Gestodene+Ethinylestradiol', 'Incepta'),
('Mercilon', 'Tablet', '0.02mg', 'Desogestrel+Ethinylestradiol', 'MSD'),
('Logynon', 'Tablet', '0.05mg', 'Norgestimate+Ethinylestradiol', 'Wyeth'),
('Triphasil', 'Tablet', '0.05mg', 'Levonorgestrel+Ethinylestradiol', 'Wyeth'),
('Tri-Regol', 'Tablet', '0.05mg', 'Levonorgestrel+Ethinylestradiol', 'Incepta');

-- ============================================================
-- ANTISPASMODIC
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Hyoscine', 'Tablet', '10mg', 'Hyoscine Butylbromide', 'Incepta'),
('Buscopan', 'Tablet', '10mg', 'Hyoscine Butylbromide', 'B Boer'),
('Dicyclomine', 'Tablet', '10mg', 'Dicyclomine', 'Incepta'),
('Bentyl', 'Tablet', '10mg', 'Dicyclomine', 'Pfizer'),
('Mebeverine', 'Tablet', '135mg', 'Mebeverine', 'Incepta'),
('Duspatal', 'Tablet', '135mg', 'Mebeverine', 'Abbott'),
('Papaverine', 'Tablet', '40mg', 'Papaverine', 'Incepta'),
('Alverine', 'Capsule', '60mg', 'Alverine', 'Incepta'),
('Meteospasmyl', 'Capsule', '60mg', 'Alverine', 'Abbott');

-- ============================================================
-- ANESTHETICS
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Lignocaine', 'Injection', '2%', 'Lignocaine HCl', 'Incepta'),
('Xylocaine', 'Injection', '2%', 'Lignocaine HCl', 'AstraZeneca'),
('Lignocaine', 'Gel', '2%', 'Lignocaine', 'Incepta'),
('Xylocaine', 'Gel', '2%', 'Lignocaine', 'AstraZeneca'),
('Lignocaine', 'Spray', '10%', 'Lignocaine', 'Incepta'),
('Xylocaine', 'Spray', '10%', 'Lignocaine', 'AstraZeneca'),
('Marcaine', 'Injection', '0.5%', 'Bupivacaine', 'AstraZeneca'),
('Bupivacaine', 'Injection', '0.5%', 'Bupivacaine', 'Incepta'),
('Ropivacaine', 'Injection', '0.75%', 'Ropivacaine', 'Incepta'),
('Naropin', 'Injection', '0.75%', 'Ropivacaine', 'AstraZeneca'),
('Prilocaine', 'Cream', '2.5%', 'Prilocaine', 'Incepta'),
('EMLA', 'Cream', '2.5%', 'Prilocaine+Lignocaine', 'AstraZeneca'),
('Tetracaine', 'Eye Drops', '0.5%', 'Tetracaine', 'Incepta'),
('Amethocaine', 'Eye Drops', '0.5%', 'Tetracaine', 'Allergan'),
('Proparacaine', 'Eye Drops', '0.5%', 'Proparacaine', 'Incepta'),
('Alcaine', 'Eye Drops', '0.5%', 'Proparacaine', 'Alcon');

-- ============================================================
-- ANTI-INFLAMMATORY EYE
-- ============================================================
INSERT INTO medicine (name, type, strength, generic, company) VALUES
('Dexamethasone', 'Eye Drops', '0.1%', 'Dexamethasone', 'Incepta'),
('Maxidex', 'Eye Drops', '0.1%', 'Dexamethasone', 'Alcon'),
('Fluorometholone', 'Eye Drops', '0.1%', 'Fluorometholone', 'Incepta'),
('FML', 'Eye Drops', '0.1%', 'Fluorometholone', 'Allergan'),
('Lotemax', 'Eye Drops', '0.5%', 'Loteprednol', 'Bausch'),
('Prednisolone', 'Eye Drops', '1%', 'Prednisolone', 'Incepta'),
('Pred Forte', 'Eye Drops', '1%', 'Prednisolone', 'Allergan'),
('Ketorolac', 'Eye Drops', '0.5%', 'Ketorolac', 'Incepta'),
('Acular', 'Eye Drops', '0.5%', 'Ketorolac', 'Allergan'),
('Nepafenac', 'Eye Drops', '0.1%', 'Nepafenac', 'Incepta'),
('Nevanac', 'Eye Drops', '0.1%', 'Nepafenac', 'Alcon'),
('Diclofenac', 'Eye Drops', '0.1%', 'Diclofenac', 'Incepta'),
('Voltarol', 'Eye Drops', '0.1%', 'Diclofenac', 'Novartis');

-- SELECT COUNT
SELECT COUNT(*) AS total_medicines FROM medicine;