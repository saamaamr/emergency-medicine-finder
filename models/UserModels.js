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

  /* ====== Contact form submission ====== */
  insertContactMessage: async (name, email, subject, message) => {
    const sql = 'CREATE TABLE IF NOT EXISTS contact_messages (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), subject VARCHAR(255), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)';
    await dbConnect.promise().execute(sql);
    const insertSql = 'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
    const [rows] = await dbConnect.promise().execute(insertSql, [name, email, subject, message]);
    return rows;
  },
};

module.exports = UserModels;
