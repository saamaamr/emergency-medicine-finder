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
      return res.redirect('/login');
    },
    requireShopkeeper: (req, res, next) => {
      if (req.cookies && req.cookies[process.env.COOKIE_NAME]) {
        req.user = { name: 'Shop', mail: 'shop@test.com', role: 'shopkeeper' };
        return next();
      }
      return res.redirect('/shopkeeperlogin');
    },
    requireAdmin: (req, res, next) => {
      if (req.cookies && req.cookies[process.env.COOKIE_NAME]) {
        req.user = { name: 'Admin', mail: 'admin@emf.com', role: 'admin' };
        return next();
      }
      return res.redirect('/admin');
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

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ========== GET Static Pages ========== */

  describe('GET /', () => {
    it('should render home page', async () => {
      UserModels.getaService.mockResolvedValue([]);
      UserModels.getUser.mockResolvedValue(null);

      const app = createApp();
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.text).toContain('Emergency Medicine Finder');
    });
  });

  describe('GET /home', () => {
    it('should render home page', async () => {
      UserModels.getaService.mockResolvedValue([]);
      UserModels.getUser.mockResolvedValue(null);

      const app = createApp();
      const res = await request(app).get('/home');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /about', () => {
    it('should render about page', async () => {
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const res = await request(app).get('/about');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /contact', () => {
    it('should render contact page', async () => {
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const res = await request(app).get('/contact');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /offer', () => {
    it('should render offer page', async () => {
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const res = await request(app).get('/offer');
      expect(res.status).toBe(200);
    });
  });

  /* ========== Auth Pages ========== */

  describe('GET /login', () => {
    it('should render login page', async () => {
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const res = await request(app).get('/login');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Login');
    });

    it('should render login page when user is already logged in', async () => {
      UserModels.getUser.mockResolvedValue([{ first_name: 'Test' }]);
      const app = createApp();
      const res = await request(app)
        .get('/login')
        .set('Cookie', [`${process.env.COOKIE_NAME}=valid-token`]);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /signup', () => {
    it('should render signup page', async () => {
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const res = await request(app).get('/signup');
      expect(res.status).toBe(200);
      expect(res.text).toContain('SignUp');
    });
  });

  describe('GET /shopkeeperlogin', () => {
    it('should render shopkeeper login page', async () => {
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const res = await request(app).get('/shopkeeperlogin');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /shopkeepersignup', () => {
    it('should render shopkeeper signup page', async () => {
      UserModels.getUser.mockResolvedValue(null);
      const app = createApp();
      const res = await request(app).get('/shopkeepersignup');
      expect(res.status).toBe(200);
    });
  });

  /* ========== Protected Routes ========== */

  describe('GET /admin', () => {
    it('should render admin page when authenticated', async () => {
      UserModels.getallUser.mockResolvedValue([]);
      UserModels.getaService.mockResolvedValue([]);
      UserModels.getallWorker.mockResolvedValue([]);

      const app = createApp();
      const res = await request(app)
        .get('/admin')
        .set('Cookie', [`${process.env.COOKIE_NAME}=admin-token`]);
      expect(res.status).toBe(200);
    });

    it('should redirect when not authenticated', async () => {
      const app = createApp();
      const res = await request(app).get('/admin');
      expect(res.status).toBe(302);
    });
  });

  describe('GET /profile', () => {
    it('should render profile page when authenticated', async () => {
      UserModels.getUser.mockResolvedValue([{ first_name: 'Test', email: 'test@test.com' }]);
      const app = createApp();
      const res = await request(app)
        .get('/profile')
        .set('Cookie', [`${process.env.COOKIE_NAME}=user-token`]);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /booked', () => {
    it('should render booked page when authenticated', async () => {
      UserModels.getUser.mockResolvedValue([{ first_name: 'Test' }]);
      UserModels.getUserBooking.mockResolvedValue([]);
      const app = createApp();
      const res = await request(app)
        .get('/booked')
        .set('Cookie', [`${process.env.COOKIE_NAME}=user-token`]);
      expect(res.status).toBe(200);
    });
  });

  /* ========== Logout ========== */

  describe('GET /logout', () => {
    it('should clear cookie and redirect to home', async () => {
      const token = jwt.sign({ name: 'Test', mail: 'test@test.com', role: 'user' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .get('/logout')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`]);

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/');
    });
  });

  describe('GET /shopkeeperlogout', () => {
    it('should redirect to shopkeeper login', async () => {
      const token = jwt.sign({ name: 'Shop', mail: 'shop@test.com', role: 'shopkeeper' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .get('/shopkeeperlogout')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`]);
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/shopkeeperlogin');
    });
  });

  describe('GET /adminlogout', () => {
    it('should redirect to admin page', async () => {
      const token = jwt.sign({ name: 'Admin', mail: 'admin@emf.com', role: 'admin' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .get('/adminlogout')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`]);
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/admin');
    });
  });

  /* ========== POST Login ========== */

  describe('POST /login', () => {
    it('should render login page with validation errors when fields are empty', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/login')
        .send({ email: '', pass: '' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('Login');
    });

    it('should render login page with auth error for invalid credentials', async () => {
      UserModels.mailCatchM.mockResolvedValue([]);

      const app = createApp();
      const res = await request(app)
        .post('/login')
        .send({ email: 'nonexistent@test.com', pass: 'wrongpass' });
      expect(res.status).toBe(200);
    });
  });

  /* ========== User Login Edge Cases ========== */

  describe('POST /login - edge cases', () => {
    it('should show active account message when user status is 0', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPass = bcrypt.hashSync('pass123', 10);
      UserModels.mailCatchM.mockResolvedValue([{
        u_id: '1', first_name: 'John', email: 'unverified@test.com',
        pass: hashedPass, status: 0,
      }]);

      const app = createApp();
      const res = await request(app)
        .post('/login')
        .send({ email: 'unverified@test.com', pass: 'pass123' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('Active your account');
    });

    it('should render login with error for wrong password', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPass = bcrypt.hashSync('pass123', 10);
      UserModels.mailCatchM.mockResolvedValue([{
        u_id: '1', first_name: 'John', email: 'john@test.com',
        pass: hashedPass, status: 1,
      }]);

      const app = createApp();
      const res = await request(app)
        .post('/login')
        .send({ email: 'john@test.com', pass: 'wrongpass' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('Login');
    });

    it('should render login with error for non-existent user', async () => {
      UserModels.mailCatchM.mockResolvedValue([]);

      const app = createApp();
      const res = await request(app)
        .post('/login')
        .send({ email: 'nobody@test.com', pass: 'pass123' });
      expect(res.status).toBe(200);
    });
  });

  /* ========== POST Shopkeeper Login ========== */

  describe('POST /shopkeeperlogin', () => {
    it('should login shopkeeper successfully and redirect to dashboard', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPass = bcrypt.hashSync('shop123', 10);
      UserModels.workermailCatchM.mockResolvedValue([{
        w_id: 1, shopname: 'Test Pharmacy', email: 'shop@test.com',
        pass: hashedPass, status: 1,
      }]);

      const app = createApp();
      const res = await request(app)
        .post('/shopkeeperlogin')
        .send({ email: 'shop@test.com', pass: 'shop123' });
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/shopkeeperdesh');
    });

    it('should show account not active message when shopkeeper status is 0', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPass = bcrypt.hashSync('shop123', 10);
      UserModels.workermailCatchM.mockResolvedValue([{
        w_id: 1, shopname: 'Test Pharmacy', email: 'pending@shop.com',
        pass: hashedPass, status: 0,
      }]);

      const app = createApp();
      const res = await request(app)
        .post('/shopkeeperlogin')
        .send({ email: 'pending@shop.com', pass: 'shop123' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('not active');
    });

    it('should show incorrect password message', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPass = bcrypt.hashSync('shop123', 10);
      UserModels.workermailCatchM.mockResolvedValue([{
        w_id: 1, shopname: 'Test Pharmacy', email: 'shop@test.com',
        pass: hashedPass, status: 1,
      }]);

      const app = createApp();
      const res = await request(app)
        .post('/shopkeeperlogin')
        .send({ email: 'shop@test.com', pass: 'wrongpass' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('Incorrect Password');
    });

    it('should show incorrect email message for non-existent shopkeeper', async () => {
      UserModels.workermailCatchM.mockResolvedValue([]);

      const app = createApp();
      const res = await request(app)
        .post('/shopkeeperlogin')
        .send({ email: 'nobody@shop.com', pass: 'shop123' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('Incorrect Email');
    });

    it('should prompt for credentials when fields are empty', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/shopkeeperlogin')
        .send({ email: '', pass: '' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('Please enter');
    });
  });

  /* ========== POST Signup ========== */

  describe('POST /signup', () => {
    it('should redirect to login on successful registration', async () => {
      UserModels.insertRegisterM.mockResolvedValue([{ insertId: 1 }]);

      const app = createApp();
      const res = await request(app)
        .post('/signup')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('gender', 'Male')
        .field('email', 'john@test.com')
        .field('phone', '01711111111')
        .field('house', '12')
        .field('road', 'Road 5')
        .field('division', 'Dhaka')
        .field('zila', 'Dhaka')
        .field('upazila', 'Mirpur')
        .field('pass', 'password123');

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/login');
    });

    it('should render signup page on validation failure', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/signup')
        .field('firstName', '')
        .field('email', '');
      expect(res.status).toBe(200);
    });

    it('should render error page on duplicate email registration', async () => {
      UserModels.insertRegisterM.mockResolvedValue({ errno: 1062 });

      const app = createApp();
      const res = await request(app)
        .post('/signup')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('gender', 'Male')
        .field('email', 'existing@test.com')
        .field('phone', '01711111111')
        .field('pass', 'password123');
      expect(res.status).toBe(200);
      expect(res.text).toContain('SignUp');
    });
  });

  /* ========== POST Shopkeeper Signup ========== */

  describe('POST /shopkeepersignup', () => {
    it('should redirect to login on successful shopkeeper registration', async () => {
      UserModels.insertWorkerRegisterM.mockResolvedValue([{ insertId: 1 }]);

      const app = createApp();
      const res = await request(app)
        .post('/shopkeepersignup')
        .field('firstName', 'Abdul')
        .field('lastName', 'Haque')
        .field('gender', 'Male')
        .field('shopname', 'Haques Pharmacy')
        .field('email', 'haque@pharmacy.com')
        .field('phone', '01811111111')
        .field('house', '23')
        .field('road', 'Road 8')
        .field('division', 'Dhaka')
        .field('zila', 'Dhaka')
        .field('upazila', 'Mirpur-12')
        .field('pass', 'shopPass123');
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/shopkeeperlogin');
    });

    it('should render error on duplicate shopkeeper email registration', async () => {
      UserModels.insertWorkerRegisterM.mockRejectedValue({ errno: 1062 });

      const app = createApp();
      const res = await request(app)
        .post('/shopkeepersignup')
        .field('firstName', 'Test')
        .field('lastName', 'Shop')
        .field('gender', 'Male')
        .field('shopname', 'Duplicate Shop')
        .field('email', 'duplicate@shop.com')
        .field('phone', '01900000000')
        .field('pass', 'shopPass123');
      expect(res.status).toBe(200);
    });
  });

  /* ========== Verification Routes ========== */

  describe('GET /verify-account/:id', () => {
    it('should redirect to login after verification', async () => {
      UserModels.updateStatus.mockResolvedValue({ affectedRows: 1 });
      const app = createApp();
      const res = await request(app).get('/verify-account/1');
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/login');
    });
  });

  describe('GET /verify-shopkeeper-account/:id', () => {
    it('should redirect after shopkeeper verification', async () => {
      UserModels.workeracUpdateStatus.mockResolvedValue({ affectedRows: 1 });
      const token = jwt.sign({ name: 'Admin', mail: 'admin@emf.com', role: 'admin' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .get('/verify-shopkeeper-account/shop@test.com')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`]);
      expect(res.status).toBe(302);
    });
  });

  describe('GET /hold-shopkeeper-account/:id', () => {
    it('should redirect after holding shopkeeper account', async () => {
      UserModels.workerHoldUpdateStatus.mockResolvedValue({ affectedRows: 1 });
      const token = jwt.sign({ name: 'Admin', mail: 'admin@emf.com', role: 'admin' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .get('/hold-shopkeeper-account/shop@test.com')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`]);
      expect(res.status).toBe(302);
    });
  });

  /* ========== Medicine Request Actions ========== */

  describe('GET /verify-medicine-request/:id', () => {
    it('should approve a medicine request and redirect', async () => {
      UserModels.requestUpdateStatus.mockResolvedValue({ affectedRows: 1 });
      const token = jwt.sign({ name: 'Shop', mail: 'shop@test.com', role: 'shopkeeper' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .get('/verify-medicine-request/1')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`]);
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/servicereq');
    });
  });

  describe('GET /hold-medicine-request/:id', () => {
    it('should hold a medicine request and redirect', async () => {
      UserModels.requestHoldUpdateStatus.mockResolvedValue({ affectedRows: 1 });
      const token = jwt.sign({ name: 'Shop', mail: 'shop@test.com', role: 'shopkeeper' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .get('/hold-medicine-request/1')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`]);
      expect(res.status).toBe(302);
    });
  });

  describe('GET /delete-medicine-request/:id', () => {
    it('should delete a medicine request and redirect', async () => {
      UserModels.getMedicineRequestById.mockResolvedValue([{ user_email: 'test@test.com' }]);
      UserModels.requestDeleteStatus.mockResolvedValue({ affectedRows: 1 });
      const token = jwt.sign({ name: 'Test', mail: 'test@test.com', role: 'user' }, process.env.JWT_SECRET);
      const app = createApp();
      const res = await request(app)
        .get('/delete-medicine-request/1')
        .set('Cookie', [`${process.env.COOKIE_NAME}=${token}`]);
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/req');
    });
  });

  /* ========== Search ========== */

  describe('GET /searchmedicine', () => {
    it('should return medicine search results', async () => {
      UserModels.getSearchMedicine.mockResolvedValue([{ mediname: 'Napa', shopname: 'Pharmacy' }]);
      const app = createApp();
      const res = await request(app).get('/searchmedicine?mname=Napa');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  /* ========== Admin Login ========== */

  describe('POST /alogin', () => {
    it('should return 302 on successful admin login', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPass = bcrypt.hashSync('admin123', 10);
      UserModels.getAdmin.mockResolvedValue([{ admin_uid: 'admin@emf.com', pass: hashedPass }]);

      const app = createApp();
      const res = await request(app)
        .post('/alogin')
        .send({ userid: 'admin@emf.com', pass: 'admin123' });
      expect(res.status).toBe(302);
    });

    it('should return error for invalid admin credentials', async () => {
      UserModels.getAdmin.mockResolvedValue([]);
      const app = createApp();
      const res = await request(app)
        .post('/alogin')
        .send({ userid: 'wrong@admin.com', pass: 'wrong' });
      expect(res.status).toBe(200);
    });

    it('should prompt for credentials when admin fields are empty', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/alogin')
        .send({ userid: '', pass: '' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('Please enter');
    });
  });
});
