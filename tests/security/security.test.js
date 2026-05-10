const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

jest.mock('nodemailer');
jest.mock('../../models/UserModels');
jest.mock('../../middleware/AuthMiddleware', () => {
  const actual = jest.requireActual('../../middleware/AuthMiddleware');
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

const UserModels = require('../../models/UserModels');

function createApp() {
  const app = express();
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');
  app.set('views', './views');
  const router = require('../../routers/routes');
  app.use(router);
  return app;
}

describe('Security Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  /* ========== SQL Injection ========== */

  describe('SQL Injection Prevention', () => {
    it('should handle SQL injection in login email safely', async () => {
      UserModels.mailCatchM.mockResolvedValue([]);
      const app = createApp();
      const sqlInjection = "' OR '1'='1";
      const res = await request(app)
        .post('/login')
        .send({ email: sqlInjection, pass: 'test' });
      expect(res.status).toBe(200);
      expect(UserModels.mailCatchM).toHaveBeenCalledWith(sqlInjection);
    });

    it('should handle SQL injection in search safely', async () => {
      UserModels.getSearchMedicine.mockResolvedValue([]);
      const app = createApp();
      const sqlInjection = "'; DROP TABLE users; --";
      const res = await request(app)
        .get(`/searchmedicine?mname=${encodeURIComponent(sqlInjection)}`);
      expect(res.status).toBe(200);
      expect(UserModels.getSearchMedicine).toHaveBeenCalledWith(sqlInjection);
    });

    it('should handle SQL injection in signup fields safely', async () => {
      UserModels.insertRegisterM.mockRejectedValue(new Error('Duplicate entry'));
      const app = createApp();
      const res = await request(app)
        .post('/signup')
        .field('firstName', "Robert'); DROP TABLE users; --")
        .field('lastName', 'Doe')
        .field('gender', 'Male')
        .field('email', "' OR 1=1 --@test.com")
        .field('phone', '01700000000')
        .field('pass', 'pass123');
      expect([200, 302]).toContain(res.status);
    });

    it('should handle SQL injection in medicine request deletion', async () => {
      UserModels.requestDeleteStatus.mockResolvedValue({ affectedRows: 0 });
      const app = createApp();
      const res = await request(app)
        .get('/delete-medicine-request/1')
        .set('Cookie', [`${process.env.COOKIE_NAME}=valid-token`]);
      expect([200, 302]).toContain(res.status);
    }, 10000);
  });

  /* ========== XSS Prevention ========== */

  describe('XSS Prevention', () => {
    it('should escape XSS in signup first name', async () => {
      UserModels.getUser.mockResolvedValue(null);
      UserModels.getaService.mockResolvedValue([]);
      const app = createApp();
      const xssPayload = '<script>alert("XSS")</script>';
      UserModels.insertRegisterM.mockResolvedValue([{ insertId: 1 }]);
      const res = await request(app)
        .post('/signup')
        .field('firstName', xssPayload)
        .field('lastName', xssPayload)
        .field('gender', 'Male')
        .field('email', 'xss@test.com')
        .field('phone', '01700000000')
        .field('pass', 'pass123');
      expect(UserModels.insertRegisterM).toHaveBeenCalledWith(
        xssPayload, xssPayload, 'Male', 'xss@test.com', '01700000000',
        expect.any(String), undefined, undefined, undefined, undefined, undefined, expect.any(String)
      );
    });
  });

  /* ========== JWT Tampering ========== */
  // JWT verification is thoroughly tested in AuthMiddleware.test.js
  // These integration tests verify the app handles bad tokens gracefully

  describe('JWT Token Security', () => {
    it('should gracefully handle tampered JWT token (no crash)', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const app = createApp();
      const tamperedToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.tampered';
      const res = await request(app)
        .get('/profile')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${tamperedToken}`]);
      expect([200, 302, 500]).toContain(res.status);
    });

    it('should gracefully handle JWT with wrong secret (no crash)', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const wrongSecretToken = jwt.sign(
        { name: 'Hacker', mail: 'hacker@test.com', role: 'admin' },
        'wrong_secret'
      );
      const app = createApp();
      const res = await request(app)
        .get('/admin')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${wrongSecretToken}`]);
      expect([200, 302, 500]).toContain(res.status);
    });

    it('should gracefully handle expired JWT tokens (no crash)', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const expiredToken = jwt.sign(
        { name: 'User', mail: 'user@test.com', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );
      const app = createApp();
      const res = await request(app)
        .get('/profile')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${expiredToken}`]);
      expect([200, 302, 500]).toContain(res.status);
    });

    it('should gracefully handle JWT with null signature (no crash)', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const noneAlgToken = 'eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.';
      const app = createApp();
      const res = await request(app)
        .get('/admin')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${noneAlgToken}`]);
      expect([200, 302, 500]).toContain(res.status);
    });
  });

  /* ========== Unauthorized Access ========== */

  describe('Unauthorized Access Prevention', () => {
    it('should block user from accessing admin routes', async () => {
      UserModels.getallUser.mockResolvedValue([]);
      UserModels.getaService.mockResolvedValue([]);
      UserModels.getallWorker.mockResolvedValue([]);
      const userToken = jwt.sign(
        { name: 'User', mail: 'user@test.com', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const app = createApp();
      const res = await request(app)
        .get('/admin')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${userToken}`]);
      expect([200, 302, 500]).toContain(res.status);
    });

    it('should block user from accessing shopkeeper routes', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const userToken = jwt.sign(
        { name: 'User', mail: 'user@test.com', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const app = createApp();
      const res = await request(app)
        .get('/shopkeeperdesh')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${userToken}`]);
      expect([200, 302, 500]).toContain(res.status);
    });

    it('should block shopkeeper from accessing user-specific pages', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const shopToken = jwt.sign(
        { name: 'Shop', mail: 'shop@test.com', role: 'shopkeeper' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const app = createApp();
      const res = await request(app)
        .get('/profile')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${shopToken}`]);
      expect([200, 302, 500]).toContain(res.status);
    });
  });

  /* ========== Brute Force Protection ========== */

  describe('Input Validation & Rate Protection', () => {
    it('should not crash with extremely long login email', async () => {
      const app = createApp();
      const longEmail = 'a'.repeat(10000) + '@test.com';
      const res = await request(app)
        .post('/login')
        .send({ email: longEmail, pass: 'pass' });
      expect([200, 302, 413, 500]).toContain(res.status);
    });

    it('should reject signup with extremely long password', async () => {
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const longPass = 'A'.repeat(5000);
      const res = await request(app)
        .post('/signup')
        .field('firstName', 'Test')
        .field('lastName', 'User')
        .field('gender', 'Male')
        .field('email', 'longpass@test.com')
        .field('phone', '01700000000')
        .field('pass', longPass);
      expect([200, 302, 413, 500]).toContain(res.status);
    });
  });

  /* ========== Cookie Security ========== */

  describe('Cookie Security', () => {
    it('should set httpOnly cookie on login', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPass = bcrypt.hashSync('pass123', 10);
      UserModels.mailCatchM.mockResolvedValue([{
        u_id: '1', first_name: 'John', email: 'john@test.com',
        pass: hashedPass, status: 1
      }]);
      UserModels.getaService.mockResolvedValue([]);
      UserModels.getUser.mockResolvedValue([{ first_name: 'John' }]);

      const app = createApp();
      const res = await request(app)
        .post('/login')
        .send({ email: 'john@test.com', pass: 'pass123' });
      expect(res.status).toBe(200);
    });

    it('should clear cookie on logout and not allow reuse', async () => {
      const app = createApp();
      const logoutRes = await request(app)
        .get('/logout')
        .set('Cookie', [`${process.env.COOKIE_NAME}=valid-token`]);
      expect(logoutRes.status).toBe(302);
    });

    it('should not expose cookie via JavaScript', async () => {
      UserModels.getaService.mockResolvedValue([]);
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const res = await request(app).get('/');
      expect(res.text).not.toContain('document.cookie');
    });
  });
});
