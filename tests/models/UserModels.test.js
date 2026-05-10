const UserModels = require('../../models/UserModels');

jest.mock('../../config/database', () => {
  const mockExecute = jest.fn();
  return {
    promise: () => ({
      execute: mockExecute,
    }),
    mockExecute,
  };
});

const db = require('../../config/database');

describe('UserModels', () => {
  beforeEach(() => {
    db.mockExecute.mockReset();
  });

  /* ========== INSERT Operations ========== */

  describe('insertRegisterM', () => {
    it('should insert a new user and return result', async () => {
      db.mockExecute.mockResolvedValue([{ insertId: 1, affectedRows: 1 }]);

      const result = await UserModels.insertRegisterM(
        'John', 'Doe', 'Male', 'john@test.com', '01711111111',
        'default-user.png', '12', 'Road 5', 'Dhaka', 'Dhaka', 'Mirpur', 'hashed_pass'
      );

      expect(result).toEqual([{ insertId: 1, affectedRows: 1 }]);
      expect(db.mockExecute).toHaveBeenCalledTimes(1);
      expect(db.mockExecute).toHaveBeenCalledWith(
        'INSERT INTO `users`(`first_name`, `last_name`, `gender`, `email`, `phone`, `propic`, `house`, `road`, `division`, `zila`, `upazila`, `pass`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        ['John', 'Doe', 'Male', 'john@test.com', '01711111111', 'default-user.png', '12', 'Road 5', 'Dhaka', 'Dhaka', 'Mirpur', 'hashed_pass']
      );
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Duplicate entry');
      db.mockExecute.mockRejectedValue(dbError);

      const result = await UserModels.insertRegisterM(
        'John', 'Doe', 'Male', 'john@test.com', '01711111111',
        'default-user.png', null, null, null, null, null, 'pass'
      );

      expect(result).toBe(dbError);
    });
  });

  describe('insertMediReqM', () => {
    it('should insert a medicine request', async () => {
      db.mockExecute.mockResolvedValue([{ insertId: 1, affectedRows: 1 }]);

      const result = await UserModels.insertMediReqM(
        1, 'john@test.com', 1, 'Napa', 'shop@test.com', 10, 'prescription.jpg'
      );

      expect(result).toEqual([{ insertId: 1, affectedRows: 1 }]);
      expect(db.mockExecute).toHaveBeenCalledWith(
        'INSERT INTO `medicine_request`(`user_id`, `user_email`, `medi_id`, `medi_name`, `shop_email`, `quantity`, `ppic`) VALUES (?,?,?,?,?,?,?)',
        [1, 'john@test.com', 1, 'Napa', 'shop@test.com', 10, 'prescription.jpg']
      );
    });
  });

  describe('insertWorkerRegisterM', () => {
    it('should insert a new worker/shopkeeper', async () => {
      db.mockExecute.mockResolvedValue([{ insertId: 1 }]);

      const result = await UserModels.insertWorkerRegisterM(
        'Abdul', 'Haque', 'Male', 'Haques Pharmacy', 'haque@pharmacy.com',
        '01811111111', 'default-shop.png', 'nid1.jpg', 'nid2.jpg',
        '23', 'Road 8', 'Dhaka', 'Dhaka', 'Mirpur-12', '23.8223', '90.3669', 'hashed_pass'
      );

      expect(result).toEqual([{ insertId: 1 }]);
    });

    it('should handle missing optional fields', async () => {
      db.mockExecute.mockResolvedValue([[{ insertId: 2 }]]);
      const result = await UserModels.insertWorkerRegisterM(
        'Test', 'User', 'Male', 'Test Shop', 'test@shop.com',
        '01900000000', null, null, null,
        null, null, null, null, null, null, null, 'pass'
      );
      expect(result).toBeDefined();
    });
  });

  describe('medicine (add to catalog)', () => {
    it('should insert a new medicine into the catalog', async () => {
      db.mockExecute.mockResolvedValue([[{ affectedRows: 1 }]]);
      await UserModels.medicine('Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco');
      expect(db.mockExecute).toHaveBeenCalledWith(
        'INSERT INTO `medicine`(`name`, `type`, `strength`, `generic`, `company`) VALUES(?,?,?,?,?)',
        ['Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco']
      );
    });
  });

  describe('shopmedicine', () => {
    it('should insert shop inventory item', async () => {
      db.mockExecute.mockResolvedValue([[{ affectedRows: 1 }]]);
      await UserModels.shopmedicine('shop@test.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 100, 5.00);
      expect(db.mockExecute).toHaveBeenCalledWith(
        'INSERT INTO `shopmedicine`( `shop_email`, `mediname`, `meditype`, `medistrength`, `medigeneric`, `medicompany`, `stock`, `price`) VALUES(?,?,?,?,?,?,?,?)',
        ['shop@test.com', 'Napa', 'Tablet', '500mg', 'Paracetamol', 'Beximco', 100, 5.00]
      );
    });
  });

  /* ========== SELECT Operations ========== */

  describe('login / getUser / mailCatchM', () => {
    it('should return user by email', async () => {
      const mockUser = [{ u_id: 1, email: 'john@test.com', pass: 'hash', first_name: 'John' }];
      db.mockExecute.mockResolvedValue([mockUser]);

      const result = await UserModels.login('john@test.com');
      expect(result).toEqual(mockUser);
      expect(db.mockExecute).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?', ['john@test.com']
      );
    });

    it('should return empty array for non-existent email', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      const result = await UserModels.login('nonexistent@test.com');
      expect(result).toEqual([]);
    });
  });

  describe('getUser', () => {
    it('should return user data by email', async () => {
      const mockUser = [{ u_id: 1, email: 'john@test.com', first_name: 'John' }];
      db.mockExecute.mockResolvedValue([mockUser]);
      const result = await UserModels.getUser('john@test.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('workermailCatchM', () => {
    it('should return worker by email', async () => {
      const mockWorker = [{ w_id: 1, email: 'haque@pharmacy.com', shopname: 'Haques Pharmacy' }];
      db.mockExecute.mockResolvedValue([mockWorker]);
      const result = await UserModels.workermailCatchM('haque@pharmacy.com');
      expect(result).toEqual(mockWorker);
    });
  });

  describe('getaService', () => {
    it('should return all medicines from catalog', async () => {
      const mockMedicines = [{ id: 1, name: 'Napa' }, { id: 2, name: 'Seclo' }];
      db.mockExecute.mockResolvedValue([mockMedicines]);
      const result = await UserModels.getaService();
      expect(result).toEqual(mockMedicines);
      expect(db.mockExecute).toHaveBeenCalledWith('SELECT * from medicine');
    });
  });

  describe('getallUser', () => {
    it('should return all users', async () => {
      const mockUsers = [{ u_id: 1, email: 'a@b.com' }, { u_id: 2, email: 'c@d.com' }];
      db.mockExecute.mockResolvedValue([mockUsers]);
      const result = await UserModels.getallUser();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getallWorker', () => {
    it('should return all workers with formatted date', async () => {
      const mockWorkers = [{ w_id: 1, shopname: 'Test Shop', fdate: '10/5/2026' }];
      db.mockExecute.mockResolvedValue([mockWorkers]);
      const result = await UserModels.getallWorker();
      expect(result).toEqual(mockWorkers);
      expect(db.mockExecute).toHaveBeenCalledWith(
        'SELECT * ,DATE_FORMAT(date,\'%d/%c/%Y\')as fdate FROM worker'
      );
    });
  });

  /* ========== UPDATE Operations ========== */

  describe('updateStatus', () => {
    it('should activate a user account', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await UserModels.updateStatus(1);
      expect(result).toEqual({ affectedRows: 1 });
      expect(db.mockExecute).toHaveBeenCalledWith(
        'UPDATE users SET status = 1 WHERE u_id = ?', [1]
      );
    });
  });

  describe('workeracUpdateStatus', () => {
    it('should activate a worker account', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await UserModels.workeracUpdateStatus('worker@test.com');
      expect(result).toEqual({ affectedRows: 1 });
    });
  });

  describe('workerHoldUpdateStatus', () => {
    it('should hold/block a worker account', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await UserModels.workerHoldUpdateStatus('worker@test.com');
      expect(result).toEqual({ affectedRows: 1 });
      expect(db.mockExecute).toHaveBeenCalledWith(
        'UPDATE worker SET status = 2 WHERE email = ?', ['worker@test.com']
      );
    });
  });

  describe('UserUpdateM', () => {
    it('should update user details', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await UserModels.UserUpdateM(
        'John', 'Doe', 'Male', 'john@test.com', '01711111111', 'pic.jpg',
        '12', 'Road 5', 'Dhaka', 'Dhaka', 'Mirpur', 'new_hash', 1
      );
      expect(result).toEqual({ affectedRows: 1 });
    });
  });

  /* ========== Medicine Request Status Updates ========== */

  describe('requestUpdateStatus', () => {
    it('should approve a medicine request', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await UserModels.requestUpdateStatus(1);
      expect(result).toEqual({ affectedRows: 1 });
      expect(db.mockExecute).toHaveBeenCalledWith(
        'UPDATE medicine_request SET status = 1 WHERE req_id = ?', [1]
      );
    });
  });

  describe('requestHoldUpdateStatus', () => {
    it('should hold a medicine request', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await UserModels.requestHoldUpdateStatus(1);
      expect(result).toEqual({ affectedRows: 1 });
      expect(db.mockExecute).toHaveBeenCalledWith(
        'UPDATE medicine_request SET status = 2 WHERE req_id = ?', [1]
      );
    });
  });

  describe('requestDeleteStatus', () => {
    it('should delete a medicine request', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await UserModels.requestDeleteStatus(1);
      expect(result).toEqual({ affectedRows: 1 });
      expect(db.mockExecute).toHaveBeenCalledWith(
        'DELETE FROM medicine_request WHERE req_id = ?', [1]
      );
    });
  });

  /* ========== Admin ========== */

  describe('getAdmin', () => {
    it('should return admin by userid', async () => {
      const mockAdmin = [{ admin_id: 1, admin_uid: 'admin@emf.com', pass: 'hash' }];
      db.mockExecute.mockResolvedValue([mockAdmin]);
      const result = await UserModels.getAdmin('admin@emf.com');
      expect(result).toEqual(mockAdmin);
    });

    it('should return empty for invalid admin', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      const result = await UserModels.getAdmin('invalid@admin.com');
      expect(result).toEqual([]);
    });
  });

  /* ========== Search ========== */

  describe('getRawMedicine', () => {
    it('should return a single medicine by id', async () => {
      const mockMedicine = { id: 1, name: 'Napa', type: 'Tablet' };
      db.mockExecute.mockResolvedValue([[mockMedicine]]);
      const result = await UserModels.getRawMedicine(1);
      expect(result).toEqual(mockMedicine);
      expect(db.mockExecute).toHaveBeenCalledWith(
        'SELECT * from medicine WHERE id = ?', [1]
      );
    });
  });

  describe('getSearchMedicine', () => {
    it('should search medicines by name with LIKE', async () => {
      const mockResults = [
        { mediname: 'Napa', shop_email: 'shop@test.com', shopname: 'Test Pharmacy' }
      ];
      db.mockExecute.mockResolvedValue([mockResults]);
      const result = await UserModels.getSearchMedicine('Napa');
      expect(result).toEqual(mockResults);
      expect(db.mockExecute).toHaveBeenCalledWith(
        'SELECT * from shopmedicine join worker on shop_email = email WHERE mediname LIKE ?',
        ['%Napa%']
      );
    });

    it('should return empty array for empty search', async () => {
      const result = await UserModels.getSearchMedicine('');
      expect(result).toEqual([]);
      expect(db.mockExecute).not.toHaveBeenCalled();
    });
  });

  /* ========== JOIN Queries ========== */

  describe('getMedicineUserReq', () => {
    it('should return user medicine requests with worker info', async () => {
      const mockReqs = [{ req_id: 1, medi_name: 'Napa', shopname: 'Pharmacy', phone: '018000' }];
      db.mockExecute.mockResolvedValue([mockReqs]);
      const result = await UserModels.getMedicineUserReq('user@test.com');
      expect(result).toEqual(mockReqs);
      expect(db.mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('FROM medicine_request join worker'),
        ['user@test.com']
      );
    });
  });

  describe('getMedicineReq', () => {
    it('should return shop medicine requests with user info', async () => {
      const mockReqs = [{ req_id: 1, medi_name: 'Napa', first_name: 'John' }];
      db.mockExecute.mockResolvedValue([mockReqs]);
      const result = await UserModels.getMedicineReq('shop@test.com');
      expect(result).toEqual(mockReqs);
    });
  });

  describe('getMedicine', () => {
    it('should return shop inventory by shop email', async () => {
      db.mockExecute.mockResolvedValue([[{ id: 1, mediname: 'Napa' }]]);
      const result = await UserModels.getMedicine('shop@test.com');
      expect(result).toHaveLength(1);
    });
  });

  describe('getUserBooking', () => {
    it('should return all services', async () => {
      db.mockExecute.mockResolvedValue([[{ ser_id: 1, service_name: 'Delivery' }]]);
      const result = await UserModels.getUserBooking('user@test.com');
      expect(result).toHaveLength(1);
    });
  });
});
