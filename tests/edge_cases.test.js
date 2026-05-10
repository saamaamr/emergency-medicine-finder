const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

jest.mock('nodemailer');
jest.mock('../models/UserModels');
jest.mock('../middleware/AuthMiddleware', () => {
  const actual = jest.requireActual('../middleware/AuthMiddleware');
  return {
    ...actual,
    requireAuth: (req, res, next) => {
      if (req.cookies && req.cookies[process.env.COOKIE_NAME]) {
        req.user = { name: 'Test', mail: 'test@test.com', role: 'user' };
        return next();
      }
      return res.redirect('/login');
    },
    checkUser: (req, res, next) => {
      req.user = req.cookies && req.cookies[process.env.COOKIE_NAME]
        ? { name: 'Test', mail: 'test@test.com', role: 'user' }
        : null;
      res.locals = { user: null, role: null };
      next();
    },
    requireUser: (req, res, next) => {
      if (req.cookies && req.cookies[process.env.COOKIE_NAME]) {
        req.user = { name: 'Test', mail: 'test@test.com', role: 'user' };
        return next();
      }
      return res.status(302).redirect('/login');
    },
    requireShopkeeper: (req, res, next) => {
      if (req.cookies && req.cookies[process.env.COOKIE_NAME]) {
        req.user = { name: 'Shop', mail: 'shop@test.com', role: 'shopkeeper' };
        return next();
      }
      return res.status(302).redirect('/shopkeeperlogin');
    },
    requireAdmin: (req, res, next) => {
      if (req.cookies && req.cookies[process.env.COOKIE_NAME]) {
        req.user = { name: 'Admin', mail: 'admin@emf.com', role: 'admin' };
        return next();
      }
      return res.status(302).redirect('/admin');
    },
    checkCurrentLogin: (req, res, next) => next(),
    redirectLoggedIn: (req, res, next) => next(),
  };
});

const UserModels = require('../models/UserModels');

function createApp() {
  const app = express();
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');
  app.set('views', './views');
  const router = require('../routers/routes');
  app.use(router);
  return app;
}

describe('Edge Case Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  /* ========== Boundary Values ========== */

  describe('Boundary Value Analysis', () => {
    it('should handle empty request body on login', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/login')
        .send({});
      expect([200, 302]).toContain(res.status);
    });

    it('should handle empty request body on signup', async () => {
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const res = await request(app)
        .post('/signup')
        .field('firstName', '')
        .field('lastName', '')
        .field('email', '');
      expect(res.status).toBe(200);
    });

    it('should handle extremely long phone number', async () => {
      UserModels.getUser.mockResolvedValue(null);
      UserModels.insertRegisterM.mockResolvedValue([{ insertId: 1 }]);
      const app = createApp();
      const res = await request(app)
        .post('/signup')
        .field('firstName', 'Test')
        .field('lastName', 'User')
        .field('gender', 'Male')
        .field('email', 'longphone@test.com')
        .field('phone', '0'.repeat(200))
        .field('pass', 'pass123');
      expect([200, 302]).toContain(res.status);
    });

    it('should handle unicode/special characters in name fields', async () => {
      UserModels.getUser.mockResolvedValue(null);
      UserModels.insertRegisterM.mockResolvedValue([{ insertId: 1 }]);
      const app = createApp();
      const res = await request(app)
        .post('/signup')
        .field('firstName', 'Jöhn Déö 🩺')
        .field('lastName', 'Μυρων')
        .field('gender', 'Male')
        .field('email', 'unicode@test.com')
        .field('phone', '01700000000')
        .field('pass', 'pass123');
      expect(UserModels.insertRegisterM).toHaveBeenCalled();
      expect([200, 302]).toContain(res.status);
    });

    it('should handle null/undefined fields in address', async () => {
      UserModels.getUser.mockResolvedValue(null);
      UserModels.insertRegisterM.mockResolvedValue([{ insertId: 1 }]);
      const app = createApp();
      const res = await request(app)
        .post('/signup')
        .field('firstName', 'Test')
        .field('lastName', 'User')
        .field('gender', 'Male')
        .field('email', 'nofields@test.com')
        .field('phone', '01700000000')
        .field('pass', 'pass123');
      expect(UserModels.insertRegisterM).toHaveBeenCalledWith(
        'Test', 'User', 'Male', 'nofields@test.com', '01700000000',
        expect.any(String), undefined, undefined, undefined, undefined, undefined,
        expect.any(String)
      );
      expect([200, 302]).toContain(res.status);
    });
  });

  /* ========== Duplicate Handling ========== */

  describe('Duplicate Data Handling', () => {
    it('should handle duplicate email on registration', async () => {
      UserModels.getUser.mockResolvedValue(null);
      UserModels.insertRegisterM.mockRejectedValue({ errno: 1062, code: 'ER_DUP_ENTRY' });
      const app = createApp();
      const res = await request(app)
        .post('/signup')
        .field('firstName', 'Test')
        .field('lastName', 'User')
        .field('gender', 'Male')
        .field('email', 'existing@test.com')
        .field('phone', '01700000000')
        .field('pass', 'pass123');
      expect(res.status).toBe(200);
    });

    it('should handle duplicate shopkeeper email', async () => {
      UserModels.getUser.mockResolvedValue(null);
      UserModels.insertWorkerRegisterM.mockRejectedValue({ errno: 1062 });
      const app = createApp();
      const res = await request(app)
        .post('/shopkeepersignup')
        .field('firstName', 'Test')
        .field('lastName', 'Shop')
        .field('gender', 'Male')
        .field('shopname', 'Test Shop')
        .field('email', 'existing@shop.com')
        .field('phone', '01800000000')
        .field('pass', 'pass123');
      expect(res.status).toBe(200);
    });
  });

  /* ========== Missing Required Fields ========== */

  describe('Missing Required Fields', () => {
    it('should reject login without email', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/login')
        .send({ pass: 'test123' });
      expect(res.status).toBe(200);
    });

    it('should reject login without password', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/login')
        .send({ email: 'test@test.com' });
      expect(res.status).toBe(200);
    });

    it('should reject admin login without credentials', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/alogin')
        .send({});
      expect(res.status).toBe(200);
    });

    it('should reject shopkeeper login without email or pass', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/shopkeeperlogin')
        .send({ email: '', pass: '' });
      expect(res.status).toBe(200);
    });
  });

  /* ========== Type Coercion ========== */

  describe('Data Type Handling', () => {
    it('should handle numeric string for quantity in medicine request', async () => {
      UserModels.getUser.mockResolvedValue([{ first_name: 'Test', u_id: '1' }]);
      UserModels.getRequestMedicine.mockResolvedValue([{ mediname: 'Napa' }]);
      UserModels.insertMediReqM.mockResolvedValue([{ insertId: 1 }]);
      const token = jwt.sign({ name: 'Test', mail: 'test@test.com', role: 'user' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .post('/request')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`])
        .field('userId', '1')
        .field('userMail', 'test@test.com')
        .field('mediId', '1')
        .field('mediName', 'Napa')
        .field('shopMail', 'shop@test.com')
        .field('quantity', '10');
      expect([200, 302]).toContain(res.status);
    });

    it('should handle negative quantity gracefully', async () => {
      UserModels.getUser.mockResolvedValue([{ first_name: 'Test', u_id: '1' }]);
      UserModels.getRequestMedicine.mockResolvedValue([{ mediname: 'Napa' }]);
      UserModels.insertMediReqM.mockResolvedValue([{ insertId: 1 }]);
      const token = jwt.sign({ name: 'Test', mail: 'test@test.com', role: 'user' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .post('/request')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`])
        .field('userId', '1')
        .field('userMail', 'test@test.com')
        .field('mediId', '1')
        .field('mediName', 'Napa')
        .field('shopMail', 'shop@test.com')
        .field('quantity', '-5');
      expect(UserModels.insertMediReqM).toHaveBeenCalledWith(
        '1', 'test@test.com', '1', 'Napa', 'shop@test.com', '-5',
        expect.any(String)
      );
    });
  });

  /* ========== Non-Existent Resources ========== */

  describe('Non-Existent Resource Handling', () => {
    it('should handle non-existent user for verification', async () => {
      UserModels.updateStatus.mockResolvedValue({ affectedRows: 0 });
      const app = createApp();
      const res = await request(app).get('/verify-account/99999');
      expect(res.status).toBe(302);
    });

    it('should handle non-existent medicine request deletion', async () => {
      UserModels.requestDeleteStatus.mockResolvedValue({ affectedRows: 0 });
      const app = createApp();
      const res = await request(app).get('/delete-medicine-request/99999');
      expect(res.status).toBe(302);
    });

    it('should handle non-existent medicine search query', async () => {
      UserModels.getSearchMedicine.mockResolvedValue([]);
      const app = createApp();
      const res = await request(app).get('/searchmedicine?mname=ZZZZZ_NOT_EXIST');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should search without query parameter', async () => {
      UserModels.getSearchMedicine.mockResolvedValue([]);
      const app = createApp();
      const res = await request(app).get('/searchmedicine');
      expect(res.status).toBe(200);
    });

    it('should handle non-existent medicine id in detail endpoint', async () => {
      UserModels.getRawMedicine.mockResolvedValue(undefined);
      const app = createApp();
      const res = await request(app).get('/medicine?mid=99999');
      expect(res.status).toBe(200);
    });
  });
});
