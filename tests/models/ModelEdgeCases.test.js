const jwt = require('jsonwebtoken');
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

describe('Model Edge Cases', () => {
  beforeEach(() => db.mockExecute.mockReset());

  /* ========== Database Error Scenarios ========== */

  describe('Database Connection Errors', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('should handle connection timeout error in select', async () => {
      db.mockExecute.mockRejectedValue(new Error('Connection timeout'));
      await expect(UserModels.getaService()).rejects.toThrow('Connection timeout');
    });

    it('should handle connection refused error in insert', async () => {
      db.mockExecute.mockRejectedValue(new Error('ECONNREFUSED'));
      const result = await UserModels.insertRegisterM(
        'T', 'U', 'Male', 'e@t.com', '0', null, null, null, null, null, null, 'hash'
      );
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('ECONNREFUSED');
    });

    it('should handle deadlock error gracefully', async () => {
      db.mockExecute.mockRejectedValue(new Error('Deadlock found'));
      const result = await UserModels.insertMediReqM(1, 'a@b.com', 1, 'Med', 's@shop.com', 1, 'pic.jpg');
      expect(result).toBeInstanceOf(Error);
    });

    it('should propagate error for models without try-catch', async () => {
      db.mockExecute.mockRejectedValue(new Error('ER_CON_COUNT_ERROR'));
      await expect(UserModels.getallUser()).rejects.toThrow('ER_CON_COUNT_ERROR');
    });
  });

  /* ========== Empty Result Sets ========== */

  describe('Empty Result Handling', () => {
    it('should return empty array when no workers exist', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      const result = await UserModels.getallWorker();
      expect(result).toEqual([]);
    });

    it('should return empty array when no users exist', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      const result = await UserModels.getallUser();
      expect(result).toEqual([]);
    });

    it('should return empty array when no medicine requests exist', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      const result = await UserModels.getMedicineReq('shop@test.com');
      expect(result).toEqual([]);
    });

    it('should return undefined when no raw medicine found', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      const result = await UserModels.getRawMedicine(999);
      expect(result).toBeUndefined();
    });
  });

  /* ========== Special Characters in Search ========== */

  describe('Search with Special Characters', () => {
    it('should handle percent character in search', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      await UserModels.getSearchMedicine('100%');
      expect(db.mockExecute).toHaveBeenCalledWith(
        'SELECT * from shopmedicine join worker on shop_email = email WHERE mediname LIKE ?',
        ['%100%%']
      );
    });

    it('should handle underscore character in search', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      await UserModels.getSearchMedicine('napa_extra');
      expect(db.mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('LIKE ?'),
        ['%napa_extra%']
      );
    });

    it('should handle empty search string', async () => {
      const result = await UserModels.getSearchMedicine('');
      expect(result).toEqual([]);
      expect(db.mockExecute).not.toHaveBeenCalled();
    });

    it('should handle null search', async () => {
      const result = await UserModels.getSearchMedicine(null);
      expect(result).toEqual([]);
      expect(db.mockExecute).not.toHaveBeenCalled();
    });

    it('should handle very long search string', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      const longQuery = 'medicine'.repeat(100);
      await UserModels.getSearchMedicine(longQuery);
      expect(db.mockExecute).toHaveBeenCalled();
    });
  });

  /* ========== Bulk Operations ========== */

  describe('Concurrent Operations Safety', () => {
    it('should handle sequential user lookups', async () => {
      db.mockExecute.mockResolvedValue([[]]);
      await Promise.all([
        UserModels.login('a@b.com'),
        UserModels.login('c@d.com'),
        UserModels.login('e@f.com'),
      ]);
      expect(db.mockExecute).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed read/write operations', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      db.mockExecute.mockResolvedValue([[{ id: 1 }]]);
      await UserModels.updateStatus(1);
      await UserModels.getUser('test@test.com');
      expect(db.mockExecute).toHaveBeenCalledTimes(2);
    });
  });

  /* ========== UPDATE Edge Cases ========== */

  describe('UPDATE Operations Edge Cases', () => {
    it('should return affectedRows=0 when updating non-existent user', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 0 }]);
      const result = await UserModels.updateStatus(99999);
      expect(result.affectedRows).toBe(0);
    });

    it('should handle user update with null fields', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await UserModels.UserUpdateM(
        null, null, null, 'email@test.com', null, null,
        null, null, null, null, null, 'hash', 1
      );
      expect(result).toBeDefined();
    });

    it('should handle multiple status updates on same record', async () => {
      db.mockExecute.mockResolvedValue([{ affectedRows: 1 }]);
      await UserModels.updateStatus(1);
      await UserModels.workerHoldUpdateStatus('shop@test.com');
      await UserModels.requestUpdateStatus(1);
      expect(db.mockExecute).toHaveBeenCalledTimes(3);
    });
  });
});
