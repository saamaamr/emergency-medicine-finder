const dbConnect = require('../config/database');

const UserModels = {

  /* <====== Insert Data in DataBase =====> */
  /* ====== user Register Model ===== */
  insertRegisterM: async (firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass) => {
    try {
      const insertRegis = 'INSERT INTO `users`(`first_name`, `last_name`, `gender`, `email`, `phone`, `propic`, `house`, `road`, `division`, `zila`, `upazila`, `pass`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
      const values = [firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass];

      return await dbConnect.promise().execute(insertRegis, values);
    } catch (err) {
      return err;
    }
  },
  insertMediReqM: async (userId, userMail, mediId, mediName, shopMail, quantity, ppic) => {
    try {
      const sql = 'INSERT INTO `medicine_request`(`user_id`, `user_email`, `medi_id`, `medi_name`, `shop_email`, `quantity`, `ppic`) VALUES (?,?,?,?,?,?,?)';
      const values = [userId, userMail, mediId, mediName, shopMail, quantity, ppic];
      return await dbConnect.promise().execute(sql, values);
    } catch (err) {
      console.log(err)
      return err;
    }
  },
  /* ====== worker Register Model ===== */
  insertWorkerRegisterM: async (firstName, lastName, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass) => {
    try {
      const insertRegis = 'INSERT INTO `worker`( `first_name`, `last_name`, `gender`, `shopname`, `email`, `phone`, `propic`, `nid1`, `nid2`, `house`, `road`, `division`, `zila`, `upazila`,lat, lng, `pass`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
      const values = [firstName, lastName, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass];
      return await dbConnect.promise().execute(insertRegis, values);
    } catch (err) {
      console.log(err)
      return err;
    }
  },
  /* ====== Service Insert Model ===== */
  medicine: async (mediname, meditype, medistrength, medigeneric, medicompany) => {
    const sql = 'INSERT INTO `medicine`(`name`, `type`, `strength`, `generic`, `company`) VALUES(?,?,?,?,?)';
    const values = [mediname, meditype, medistrength, medigeneric, medicompany]
    const [rows] = await dbConnect.promise().execute(sql, values);
    return rows;
  },

  shopmedicine: async (shopemail, mediname, meditype, medistrength, medigeneric, medicompany, medistock, mediprice) => {
    const sql = 'INSERT INTO `shopmedicine`( `shop_email`, `mediname`, `meditype`, `medistrength`, `medigeneric`, `medicompany`, `stock`, `price`) VALUES(?,?,?,?,?,?,?,?)';
    const values = [shopemail, mediname, meditype, medistrength, medigeneric, medicompany, medistock, mediprice]
    const [rows] = await dbConnect.promise().execute(sql, values);
    return rows;
  },

  /* <====== Catch Data from DataBase ===== > */

  login: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await dbConnect.promise().execute(sql, [email]);
    return rows;
  },

  getUser: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await dbConnect.promise().execute(sql, [email]);
    return rows;
  },

  getService: async (sId) => {
    const sql = 'SELECT * FROM org_service WHERE ser_id = ?';
    const [rows] = await dbConnect.promise().execute(sql, [sId]);
    return rows;
  },
  getMedicine: async (sId) => {
    const sql = 'SELECT * FROM shopmedicine WHERE shop_email = ?';
    const [rows] = await dbConnect.promise().execute(sql, [sId]);
    return rows;
  },
  getallUser: async () => {
    const sql = 'SELECT * FROM users ';
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  getaService: async () => {
    const sql = 'SELECT * from medicine';
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },
  getallWorker: async () => {
    const sql = 'SELECT * ,DATE_FORMAT(date,\'%d/%c/%Y\')as fdate FROM worker';
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  mailCatchM: async (mail) => {
    const getMail = 'SELECT * FROM users WHERE email= ?';
    const value = [mail];
    const [row] = await dbConnect.promise().execute(getMail, value);
    return row;
  },

  workermailCatchM: async (mail) => {
    const getMail = 'SELECT * FROM worker WHERE email= ?';
    const value = [mail];
    const [row] = await dbConnect.promise().execute(getMail, value);
    return row;
  },

  /* ====== Update DB ===== */
  updateStatus: async (userId) => {
    const sql = 'UPDATE users SET status = 1 WHERE u_id = ?'
    const [row] = await dbConnect.promise().execute(sql, [userId])
    return row
  },

  workeracUpdateStatus: async (userId) => {
    const sql = 'UPDATE worker SET status = 1 WHERE email = ?'
    const [row] = await dbConnect.promise().execute(sql, [userId])
    return row
  },

  workerHoldUpdateStatus: async (userId) => {
    const sql = 'UPDATE worker SET status = 2 WHERE email = ?'
    const [row] = await dbConnect.promise().execute(sql, [userId])
    return row
  },
  requestUpdateStatus: async (reqid) => {
    const sql = 'UPDATE medicine_request SET status = 1 WHERE req_id = ?'
    const [row] = await dbConnect.promise().execute(sql, [reqid])
    return row
  },
  requestHoldUpdateStatus: async (reqid) => {
    const sql = 'UPDATE medicine_request SET status = 2 WHERE req_id = ?'
    const [row] = await dbConnect.promise().execute(sql, [reqid])
    return row
  },

  getMedicineRequestById: async (reqid) => {
    const sql = 'SELECT * FROM medicine_request WHERE req_id = ?'
    const [rows] = await dbConnect.promise().execute(sql, [reqid])
    return rows
  },

  requestDeleteStatus: async (reqid) => {
    const sql = 'DELETE FROM medicine_request WHERE req_id = ?'
    const [row] = await dbConnect.promise().execute(sql, [reqid])
    return row
  },

  /* ====== user update Model ===== */
  UserUpdateM: async (firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass, userId) => {
    try {
      const sql = 'update users set first_name=?, last_name=?, gender=?, email=?, phone=?, propic=?, house=?, road=?, division=?, zila=?, upazila=?, pass=? WHERE u_id = ?';
      const values = [firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass, userId];
      const [row] = await dbConnect.promise().execute(sql, values)
      return row;
    } catch (err) {
      console.log(err)
      return err;
    }
  },

  /* ====== Get Data from DB ===== */
  getAdmin: async (userid) => {
    const sql = 'SELECT * FROM admin WHERE admin_uid = ?';
    const [rows] = await dbConnect.promise().execute(sql, [userid]);
    return rows;
  },

  getRawMedicine: async (mid) => {
    const sql = 'SELECT * from medicine WHERE id = ?';
    const [rows] = await dbConnect.promise().execute(sql, [mid]);
    return rows[0];
  },
  getSearchMedicine: async (mname) => {
    if (!mname) return []
    const sql = 'SELECT * from shopmedicine join worker on shop_email = email WHERE mediname LIKE ?';
    const [rows] = await dbConnect.promise().execute(sql, [`%${mname}%`]);
    return rows;
  },
  getMedicineSuggestions: async (prefix) => {
    if (!prefix || prefix.trim().length < 1) return []
    const sql = 'SELECT DISTINCT mediname FROM shopmedicine WHERE mediname LIKE ? LIMIT 10';
    const [rows] = await dbConnect.promise().execute(sql, [`${prefix}%`]);
    return rows.map(r => r.mediname);
  },
  getRequestMedicine: async (mid) => {
    const sql = 'SELECT * from shopmedicine WHERE id = ?';
    const [rows] = await dbConnect.promise().execute(sql, [mid]);
    return rows;
  },
  getMedicineUserReq: async (mail) => {
    const sql = 'SELECT medicine_request.req_id,medicine_request.shop_email,medicine_request.medi_name,medicine_request.quantity,medicine_request.ppic,medicine_request.status,worker.shopname,worker.phone FROM medicine_request join worker on medicine_request.shop_email=worker.email WHERE user_email = ?';
    const value = [mail];
    const [rows] = await dbConnect.promise().execute(sql, value);
    return rows;
  },

  getMedicineReq: async (mail) => {
    const sql = 'SELECT medicine_request.req_id,medicine_request.medi_name,medicine_request.user_email,users.first_name,users.last_name,medicine_request.quantity,medicine_request.ppic,medicine_request.status,users.phone FROM medicine_request join users on medicine_request.user_email=users.email WHERE shop_email = ?';
    const value = [mail];
    const [rows] = await dbConnect.promise().execute(sql, value);
    return rows;
  },
  getUserBooking: async (email) => {
    const sql = 'SELECT medicine_request.*, worker.shopname, worker.phone FROM medicine_request JOIN worker ON medicine_request.shop_email = worker.email WHERE medicine_request.user_email = ?';
    const [rows] = await dbConnect.promise().execute(sql, [email]);
    return rows;
  },

  /* ====== Admin: View all shop inventories ====== */
  getAllShopInventories: async () => {
    const sql = 'SELECT shopmedicine.*, worker.shopname, worker.phone, worker.lat, worker.lng FROM shopmedicine JOIN worker ON shopmedicine.shop_email = worker.email ORDER BY worker.shopname, shopmedicine.mediname';
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  getShopInventoryByEmail: async (email) => {
    const sql = 'SELECT * FROM shopmedicine WHERE shop_email = ?';
    const [rows] = await dbConnect.promise().execute(sql, [email]);
    return rows;
  },

  getAllWorkers: async () => {
    const sql = 'SELECT email, shopname, phone, division, zila FROM worker WHERE status = 1';
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  /* ====== Stock Transfer ====== */
  createStockTransfer: async (fromShop, toShop, medicineName, quantity, requestedBy) => {
    const sql = 'INSERT INTO stock_transfer (from_shop_email, to_shop_email, medicine_name, quantity, requested_by) VALUES (?, ?, ?, ?, ?)';
    const [rows] = await dbConnect.promise().execute(sql, [fromShop, toShop, medicineName, quantity, requestedBy]);
    return rows;
  },

  getStockTransfers: async () => {
    const sql = `SELECT stock_transfer.*, 
      from_worker.shopname AS from_shop_name, 
      to_worker.shopname AS to_shop_name 
      FROM stock_transfer 
      JOIN worker AS from_worker ON stock_transfer.from_shop_email = from_worker.email 
      JOIN worker AS to_worker ON stock_transfer.to_shop_email = to_worker.email 
      ORDER BY stock_transfer.created_at DESC`;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  updateStockTransferStatus: async (transferId, status) => {
    const sql = 'UPDATE stock_transfer SET status = ? WHERE transfer_id = ?';
    const [rows] = await dbConnect.promise().execute(sql, [status, transferId]);
    return rows;
  },

  updateShopMedicineStock: async (shopEmail, medicineName, quantity) => {
    const sql = 'UPDATE shopmedicine SET stock = stock - ? WHERE shop_email = ? AND mediname = ? AND stock >= ?';
    const [rows] = await dbConnect.promise().execute(sql, [quantity, shopEmail, medicineName, quantity]);
    return rows;
  },

  addShopMedicineStock: async (shopEmail, medicineName, quantity) => {
    const sql = 'UPDATE shopmedicine SET stock = stock + ? WHERE shop_email = ? AND mediname = ?';
    const [rows] = await dbConnect.promise().execute(sql, [quantity, shopEmail, medicineName]);
    return rows;
  },

  /* ====== Shopkeeper Profile Update ====== */
  updateWorkerProfile: async (firstName, lastName, gender, phone, house, road, division, zila, upazila, lat, lng, propic, email) => {
    let sql, values;
    if (propic) {
      sql = 'UPDATE worker SET first_name=?, last_name=?, gender=?, phone=?, house=?, road=?, division=?, zila=?, upazila=?, lat=?, lng=?, propic=? WHERE email=?';
      values = [firstName, lastName, gender, phone, house, road, division, zila, upazila, lat, lng, propic, email];
    } else {
      sql = 'UPDATE worker SET first_name=?, last_name=?, gender=?, phone=?, house=?, road=?, division=?, zila=?, upazila=?, lat=?, lng=? WHERE email=?';
      values = [firstName, lastName, gender, phone, house, road, division, zila, upazila, lat, lng, email];
    }
    const [rows] = await dbConnect.promise().execute(sql, values);
    return rows;
  },

  /* ====== Contact form submission ====== */
  insertContactMessage: async (name, email, subject, message) => {
    const sql = 'CREATE TABLE IF NOT EXISTS contact_messages (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), subject VARCHAR(255), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)';
    await dbConnect.promise().execute(sql);
    const insertSql = 'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
    const [rows] = await dbConnect.promise().execute(insertSql, [name, email, subject, message]);
    return rows;
  },

  /* ====== Session Management ====== */
  createSession: async (email, role, browserKey, deviceInfo, ipAddress, expiresAt) => {
    const sql = 'INSERT INTO active_sessions (user_email, user_role, browser_key, device_info, ip_address, expires_at) VALUES (?, ?, ?, ?, ?, ?)';
    const [rows] = await dbConnect.promise().execute(sql, [email, role, browserKey, deviceInfo, ipAddress, expiresAt]);
    return rows;
  },

  getActiveSession: async (email, role) => {
    const sql = 'SELECT * FROM active_sessions WHERE user_email = ? AND user_role = ?';
    const [rows] = await dbConnect.promise().execute(sql, [email, role]);
    return rows[0] || null;
  },

  getSessionByBrowserKey: async (browserKey) => {
    const sql = 'SELECT * FROM active_sessions WHERE browser_key = ?';
    const [rows] = await dbConnect.promise().execute(sql, [browserKey]);
    return rows[0] || null;
  },

  deleteSession: async (email, role) => {
    const sql = 'DELETE FROM active_sessions WHERE user_email = ? AND user_role = ?';
    const [rows] = await dbConnect.promise().execute(sql, [email, role]);
    return rows;
  },

  deleteSessionByBrowserKey: async (browserKey) => {
    const sql = 'DELETE FROM active_sessions WHERE browser_key = ?';
    const [rows] = await dbConnect.promise().execute(sql, [browserKey]);
    return rows;
  },

  cleanupExpiredSessions: async () => {
    const sql = 'DELETE FROM active_sessions WHERE expires_at < NOW()';
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  deleteAllUserSessions: async (email) => {
    const sql = 'DELETE FROM active_sessions WHERE user_email = ?';
    const [rows] = await dbConnect.promise().execute(sql, [email]);
    return rows;
  },

  getUserSessions: async (email) => {
    const sql = 'SELECT session_id, user_role, device_info, ip_address, created_at, expires_at, last_activity FROM active_sessions WHERE user_email = ? ORDER BY created_at DESC';
    const [rows] = await dbConnect.promise().execute(sql, [email]);
    return rows;
  },

  checkEmailAcrossRoles: async (email) => {
    const [users] = await dbConnect.promise().execute('SELECT email FROM users WHERE email = ?', [email]);
    const [workers] = await dbConnect.promise().execute('SELECT email FROM worker WHERE email = ?', [email]);
    const [admins] = await dbConnect.promise().execute('SELECT admin_uid FROM admin WHERE admin_uid = ?', [email]);
    return users.length > 0 || workers.length > 0 || admins.length > 0;
  },

  /* ====== Supplier CRUD ====== */
  getAllSuppliers: async (shopEmail) => {
    const sql = 'SELECT * FROM suppliers WHERE shop_email = ? ORDER BY name ASC';
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail]);
    return rows;
  },

  getSupplier: async (supplierId) => {
    const sql = 'SELECT * FROM suppliers WHERE supplier_id = ?';
    const [rows] = await dbConnect.promise().execute(sql, [supplierId]);
    return rows[0] || null;
  },

  createSupplier: async (shopEmail, name, company, email, phone, address, city) => {
    const sql = 'INSERT INTO suppliers (shop_email, name, company, email, phone, address, city) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail, name, company, email, phone, address, city]);
    return rows;
  },

  updateSupplier: async (supplierId, shopEmail, name, company, email, phone, address, city) => {
    const sql = 'UPDATE suppliers SET name=?, company=?, email=?, phone=?, address=?, city=? WHERE supplier_id=? AND shop_email=?';
    const [rows] = await dbConnect.promise().execute(sql, [name, company, email, phone, address, city, supplierId, shopEmail]);
    return rows;
  },

  deleteSupplier: async (supplierId, shopEmail) => {
    const sql = 'DELETE FROM suppliers WHERE supplier_id=? AND shop_email=?';
    const [rows] = await dbConnect.promise().execute(sql, [supplierId, shopEmail]);
    return rows;
  },

  /* ====== Expense Category CRUD ====== */
  getAllExpenseCategories: async (shopEmail) => {
    const sql = 'SELECT * FROM expense_categories WHERE shop_email = ? ORDER BY name ASC';
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail]);
    return rows;
  },

  createExpenseCategory: async (shopEmail, name, type) => {
    const sql = 'INSERT INTO expense_categories (shop_email, name, type) VALUES (?, ?, ?)';
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail, name, type]);
    return rows;
  },

  /* ====== Expense CRUD ====== */
  getAllExpenses: async (shopEmail) => {
    const sql = `SELECT e.*, ec.name as category_name, ec.type as category_type 
      FROM expenses e 
      JOIN expense_categories ec ON e.category_id = ec.category_id 
      WHERE e.shop_email = ? 
      ORDER BY e.expense_date DESC, e.created_at DESC`;
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail]);
    return rows;
  },

  getExpense: async (expenseId) => {
    const sql = 'SELECT e.*, ec.name as category_name FROM expenses e JOIN expense_categories ec ON e.category_id=ec.category_id WHERE e.expense_id = ?';
    const [rows] = await dbConnect.promise().execute(sql, [expenseId]);
    return rows[0] || null;
  },

  createExpense: async (shopEmail, categoryId, description, amount, expenseDate, paymentMethod, referenceNo) => {
    const sql = 'INSERT INTO expenses (shop_email, category_id, description, amount, expense_date, payment_method, reference_no) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail, categoryId, description, amount, expenseDate, paymentMethod, referenceNo || null]);
    return rows;
  },

  updateExpense: async (expenseId, categoryId, description, amount, expenseDate, paymentMethod, referenceNo) => {
    const sql = 'UPDATE expenses SET category_id=?, description=?, amount=?, expense_date=?, payment_method=?, reference_no=? WHERE expense_id=?';
    const [rows] = await dbConnect.promise().execute(sql, [categoryId, description, amount, expenseDate, paymentMethod, referenceNo || null, expenseId]);
    return rows;
  },

  deleteExpense: async (expenseId) => {
    const sql = 'DELETE FROM expenses WHERE expense_id=?';
    const [rows] = await dbConnect.promise().execute(sql, [expenseId]);
    return rows;
  },

  /* ====== Purchase CRUD ====== */
  getAllPurchases: async (shopEmail) => {
    const sql = `SELECT p.*, s.name as supplier_name 
      FROM purchases p 
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id 
      WHERE p.shop_email = ? 
      ORDER BY p.purchase_date DESC, p.created_at DESC`;
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail]);
    return rows;
  },

  getPurchase: async (purchaseId) => {
    const sql = `SELECT p.*, s.name as supplier_name, s.phone as supplier_phone, s.address as supplier_address
      FROM purchases p 
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id 
      WHERE p.purchase_id = ?`;
    const [rows] = await dbConnect.promise().execute(sql, [purchaseId]);
    return rows[0] || null;
  },

  getPurchaseItems: async (purchaseId) => {
    const sql = 'SELECT * FROM purchase_items WHERE purchase_id = ? ORDER BY item_id ASC';
    const [rows] = await dbConnect.promise().execute(sql, [purchaseId]);
    return rows;
  },

  createPurchase: async (shopEmail, supplierId, invoiceNo, purchaseDate, subtotal, discount, vat, totalAmount, paidAmount, dueAmount, paymentStatus, notes) => {
    const sql = `INSERT INTO purchases 
      (shop_email, supplier_id, invoice_no, purchase_date, subtotal, discount, vat, total_amount, paid_amount, due_amount, payment_status, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [rows] = await dbConnect.promise().execute(sql, [
      shopEmail, supplierId || null, invoiceNo, purchaseDate, subtotal, discount || 0, vat || 0,
      totalAmount, paidAmount, dueAmount, paymentStatus, notes || null
    ]);
    return rows;
  },

  createPurchaseItem: async (purchaseId, medicineName, batchNo, expiryDate, quantity, unitPrice, mrp, total) => {
    const sql = 'INSERT INTO purchase_items (purchase_id, medicine_name, batch_no, expiry_date, quantity, unit_price, mrp, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await dbConnect.promise().execute(sql, [purchaseId, medicineName, batchNo || null, expiryDate || null, quantity, unitPrice, mrp || null, total]);
    return rows;
  },

  deletePurchase: async (purchaseId) => {
    const sql = 'DELETE FROM purchases WHERE purchase_id = ?';
    const [rows] = await dbConnect.promise().execute(sql, [purchaseId]);
    return rows;
  },

  updatePurchasePayment: async (purchaseId, paidAmount, dueAmount, paymentStatus) => {
    const sql = 'UPDATE purchases SET paid_amount=?, due_amount=?, payment_status=? WHERE purchase_id=?';
    const [rows] = await dbConnect.promise().execute(sql, [paidAmount, dueAmount, paymentStatus, purchaseId]);
    return rows;
  },

  /* ====== Sale CRUD ====== */
  getAllSales: async (shopEmail) => {
    const sql = 'SELECT * FROM sales WHERE shop_email = ? ORDER BY sale_date DESC, created_at DESC';
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail]);
    return rows;
  },

  getSale: async (saleId) => {
    const sql = 'SELECT * FROM sales WHERE sale_id = ?';
    const [rows] = await dbConnect.promise().execute(sql, [saleId]);
    return rows[0] || null;
  },

  getSaleItems: async (saleId) => {
    const sql = 'SELECT * FROM sale_items WHERE sale_id = ? ORDER BY item_id ASC';
    const [rows] = await dbConnect.promise().execute(sql, [saleId]);
    return rows;
  },

  createSale: async (shopEmail, invoiceNo, saleDate, customerName, customerPhone, subtotal, discount, vat, totalAmount, paidAmount, dueAmount, profitAmount, paymentMethod, saleType) => {
    const sql = `INSERT INTO sales 
      (shop_email, invoice_no, sale_date, customer_name, customer_phone, subtotal, discount, vat, total_amount, paid_amount, due_amount, profit_amount, payment_method, sale_type) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [rows] = await dbConnect.promise().execute(sql, [
      shopEmail, invoiceNo, saleDate, customerName || null, customerPhone || null,
      subtotal, discount || 0, vat || 0, totalAmount, paidAmount, dueAmount, profitAmount, paymentMethod, saleType || 'retail'
    ]);
    return rows;
  },

  createSaleItem: async (saleId, medicineName, batchNo, quantity, unitPrice, costPrice, mrp, total, profit) => {
    const sql = 'INSERT INTO sale_items (sale_id, medicine_name, batch_no, quantity, unit_price, cost_price, mrp, total, profit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await dbConnect.promise().execute(sql, [saleId, medicineName, batchNo || null, quantity, unitPrice, costPrice, mrp || null, total, profit]);
    return rows;
  },

  deleteSale: async (saleId) => {
    const sql = 'DELETE FROM sales WHERE sale_id = ?';
    const [rows] = await dbConnect.promise().execute(sql, [saleId]);
    return rows;
  },

  /* ====== Reports & Dashboard ====== */
  getDashboardSummary: async (shopEmail) => {
    const today = new Date().toISOString().slice(0, 10);
    const sql = `SELECT 
      (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE shop_email = ? AND DATE(sale_date) = ?) as today_sales,
      (SELECT COALESCE(SUM(profit_amount), 0) FROM sales WHERE shop_email = ? AND DATE(sale_date) = ?) as today_profit,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE shop_email = ? AND expense_date = ?) as today_expenses,
      (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE shop_email = ?) as total_sales,
      (SELECT COALESCE(SUM(profit_amount), 0) FROM sales WHERE shop_email = ?) as total_profit,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE shop_email = ?) as total_expenses,
      (SELECT COALESCE(SUM(due_amount), 0) FROM purchases WHERE shop_email = ? AND payment_status IN ('partial', 'due')) as total_purchase_due,
      (SELECT COALESCE(SUM(due_amount), 0) FROM sales WHERE shop_email = ? AND due_amount > 0) as total_sale_due,
      (SELECT COUNT(*) FROM suppliers WHERE shop_email = ?) as total_suppliers,
      (SELECT COUNT(*) FROM shopmedicine WHERE shop_email = ? AND stock <= 10) as low_stock_count`;
    const [rows] = await dbConnect.promise().execute(sql, [
      shopEmail, today, shopEmail, today, shopEmail, today,
      shopEmail, shopEmail, shopEmail, shopEmail, shopEmail, shopEmail, shopEmail
    ]);
    return rows[0];
  },

  getProfitLossReport: async (shopEmail, startDate, endDate) => {
    const sql = `SELECT 
      (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE shop_email = ? AND DATE(sale_date) BETWEEN ? AND ?) as total_sales,
      (SELECT COALESCE(SUM(profit_amount), 0) FROM sales WHERE shop_email = ? AND DATE(sale_date) BETWEEN ? AND ?) as total_profit,
      (SELECT COALESCE(SUM(total_amount), 0) FROM purchases WHERE shop_email = ? AND purchase_date BETWEEN ? AND ?) as total_purchases,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE shop_email = ? AND expense_date BETWEEN ? AND ?) as total_expenses`;
    const [rows] = await dbConnect.promise().execute(sql, [
      shopEmail, startDate, endDate,
      shopEmail, startDate, endDate,
      shopEmail, startDate, endDate,
      shopEmail, startDate, endDate
    ]);
    return rows[0];
  },

  getSalesByDateRange: async (shopEmail, startDate, endDate) => {
    const sql = 'SELECT * FROM sales WHERE shop_email = ? AND DATE(sale_date) BETWEEN ? AND ? ORDER BY sale_date DESC';
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail, startDate, endDate]);
    return rows;
  },

  getPurchasesByDateRange: async (shopEmail, startDate, endDate) => {
    const sql = `SELECT p.*, s.name as supplier_name FROM purchases p 
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id 
      WHERE p.shop_email = ? AND p.purchase_date BETWEEN ? AND ? ORDER BY p.purchase_date DESC`;
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail, startDate, endDate]);
    return rows;
  },

  getExpensesByDateRange: async (shopEmail, startDate, endDate) => {
    const sql = `SELECT e.*, ec.name as category_name, ec.type as category_type 
      FROM expenses e JOIN expense_categories ec ON e.category_id=ec.category_id 
      WHERE e.shop_email = ? AND e.expense_date BETWEEN ? AND ? ORDER BY e.expense_date DESC`;
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail, startDate, endDate]);
    return rows;
  },

  getLowStockMedicines: async (shopEmail, threshold) => {
    const sql = 'SELECT * FROM shopmedicine WHERE shop_email = ? AND stock <= ? ORDER BY stock ASC';
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail, threshold || 10]);
    return rows;
  },

  getExpenseStatsByCategory: async (shopEmail, startDate, endDate) => {
    const sql = `SELECT ec.name, ec.type, COALESCE(SUM(e.amount), 0) as total
      FROM expense_categories ec
      LEFT JOIN expenses e ON ec.category_id = e.category_id AND e.expense_date BETWEEN ? AND ?
      WHERE ec.shop_email = ?
      GROUP BY ec.category_id, ec.name, ec.type
      ORDER BY total DESC`;
    const [rows] = await dbConnect.promise().execute(sql, [startDate, endDate, shopEmail]);
    return rows;
  },

  getMonthlySalesSummary: async (shopEmail, year, month) => {
    const sql = `SELECT 
      COALESCE(SUM(total_amount), 0) as total_sales,
      COALESCE(SUM(profit_amount), 0) as total_profit,
      COUNT(*) as sale_count
      FROM sales 
      WHERE shop_email = ? AND YEAR(sale_date) = ? AND MONTH(sale_date) = ?`;
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail, year, month]);
    return rows[0];
  },

  getMonthlyExpenseSummary: async (shopEmail, year, month) => {
    const sql = `SELECT COALESCE(SUM(amount), 0) as total_expenses
      FROM expenses 
      WHERE shop_email = ? AND YEAR(expense_date) = ? AND MONTH(expense_date) = ?`;
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail, year, month]);
    return rows[0];
  },
};

module.exports = UserModels;
