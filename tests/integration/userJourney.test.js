const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

const userToken = jwt.sign(
  { name: 'Rahim', mail: 'rahim@email.com', role: 'user' },
  process.env.JWT_SECRET, { expiresIn: '1h' }
);

const shopToken = jwt.sign(
  { name: 'Haques Pharmacy', mail: 'haque@pharmacy.com', role: 'shopkeeper' },
  process.env.JWT_SECRET, { expiresIn: '1h' }
);

describe('User Journey: Complete Medicine Request Flow', () => {
  beforeEach(() => jest.clearAllMocks());

  it('Flow Step 1: Browse available medicines as guest', async () => {
    UserModels.getaService.mockResolvedValue([
      { id: 1, name: 'Napa', type: 'Tablet', strength: '500mg', generic: 'Paracetamol', company: 'Beximco' }
    ]);
    const app = createApp();
    const res = await request(app).get('/service');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Napa');
  });

  it('Flow Step 2: Search for specific medicine', async () => {
    UserModels.getSearchMedicine.mockResolvedValue([
      { mediname: 'Napa', shopname: 'Haques Pharmacy', price: '5.00', stock: 200 }
    ]);
    const app = createApp();
    const res = await request(app).get('/searchmedicine?mname=Napa');
    expect(res.status).toBe(200);
    expect(res.body[0].mediname).toBe('Napa');
    expect(res.body[0].shopname).toBe('Haques Pharmacy');
  });

  it('Flow Step 3: View medicine detail', async () => {
    UserModels.getRawMedicine.mockResolvedValue(
      { id: 1, name: 'Napa', type: 'Tablet', strength: '500mg', generic: 'Paracetamol', company: 'Beximco' }
    );
    const app = createApp();
    const res = await request(app).get('/medicine?mid=1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Napa');
  });

  it('Flow Step 4: User registers new account', async () => {
    UserModels.getUser.mockResolvedValue(null);
    UserModels.insertRegisterM.mockResolvedValue([{ insertId: 5 }]);
    const app = createApp();
    const res = await request(app)
      .post('/signup')
      .field('firstName', 'New')
      .field('lastName', 'User')
      .field('gender', 'Male')
      .field('email', 'newuser@test.com')
      .field('phone', '01799999999')
      .field('house', '10')
      .field('road', 'Road 1')
      .field('division', 'Dhaka')
      .field('zila', 'Dhaka')
      .field('upazila', 'Mirpur')
      .field('pass', 'securePass123');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
    expect(UserModels.insertRegisterM).toHaveBeenCalledTimes(1);
  });

  it('Flow Step 5: User verifies account via verification link', async () => {
    UserModels.updateStatus.mockResolvedValue({ affectedRows: 1 });
    const app = createApp();
    const res = await request(app).get('/verify-account/5');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
    expect(UserModels.updateStatus).toHaveBeenCalledWith('5');
  });

  it('Flow Step 6: User logs in with correct credentials', async () => {
    const hashedPass = bcrypt.hashSync('securePass123', 10);
    UserModels.mailCatchM.mockResolvedValue([{
      u_id: '5', first_name: 'New', last_name: 'User',
      email: 'newuser@test.com', pass: hashedPass, status: 1
    }]);
    UserModels.getaService.mockResolvedValue([]);
    UserModels.getUser.mockResolvedValue([{ first_name: 'New' }]);
    const app = createApp();
    const res = await request(app)
      .post('/login')
      .send({ email: 'newuser@test.com', pass: 'securePass123' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('New');
  });

  it('Flow Step 7: User views profile after login', async () => {
    UserModels.getUser.mockResolvedValue([{
      u_id: 5, first_name: 'New', last_name: 'User',
      email: 'newuser@test.com', phone: '01799999999'
    }]);
    const app = createApp();
    const res = await request(app)
      .get('/profile')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${userToken}`]);
    expect(res.status).toBe(200);
    expect(res.text).toContain('New');
    expect(res.text).toContain('newuser@test.com');
  });

  it('Flow Step 8: User places a medicine request', async () => {
    UserModels.getUser.mockResolvedValue([{ u_id: 5, first_name: 'New' }]);
    UserModels.getRequestMedicine.mockResolvedValue([{ id: 1, mediname: 'Napa', shop_email: 'haque@pharmacy.com' }]);
    UserModels.insertMediReqM.mockResolvedValue([{ insertId: 10 }]);
    const app = createApp();
    const res = await request(app)
      .post('/request')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${userToken}`])
      .field('userId', '5')
      .field('userMail', 'newuser@test.com')
      .field('mediId', '1')
      .field('mediName', 'Napa')
      .field('shopMail', 'haque@pharmacy.com')
      .field('quantity', '10');
    expect(res.status).toBe(302);
    expect(UserModels.insertMediReqM).toHaveBeenCalled();
  });

  it('Flow Step 9: Shopkeeper views pending requests', async () => {
    UserModels.workermailCatchM.mockResolvedValue([{ shopname: 'Haques Pharmacy', email: 'haque@pharmacy.com' }]);
    UserModels.getMedicineReq.mockResolvedValue([
      { req_id: 10, medi_name: 'Napa', first_name: 'New', last_name: 'User', quantity: 10, status: 0 }
    ]);
    const app = createApp();
    const res = await request(app)
      .get('/servicereq')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${shopToken}`]);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Napa');
    expect(res.text).toContain('Pending');
  });

  it('Flow Step 10: Shopkeeper approves the request', async () => {
    UserModels.requestUpdateStatus.mockResolvedValue({ affectedRows: 1 });
    const app = createApp();
    const res = await request(app)
      .get('/verify-medicine-request/10')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${shopToken}`]);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/servicereq');
    expect(UserModels.requestUpdateStatus).toHaveBeenCalledWith('10');
  });

  it('Flow Step 11: User views their request history', async () => {
    UserModels.getUser.mockResolvedValue([{ first_name: 'New' }]);
    UserModels.getMedicineUserReq.mockResolvedValue([
      { req_id: 10, medi_name: 'Napa', quantity: 10, status: 1, shopname: 'Haques Pharmacy' }
    ]);
    const app = createApp();
    const res = await request(app)
      .get('/req')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${userToken}`]);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Napa');
  });

  it('Flow Step 12: User logs out', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/logout')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${userToken}`]);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
    const profileRes = await request(app).get('/profile');
    expect(profileRes.status).toBe(302);
  });
});

describe('Admin Journey', () => {
  beforeEach(() => jest.clearAllMocks());

  it('Admin logs in and views dashboard', async () => {
    const hashedPass = bcrypt.hashSync('admin123', 10);
    UserModels.getAdmin.mockResolvedValue([{ admin_uid: 'admin@emf.com', pass: hashedPass }]);
    const app = createApp();
    const res = await request(app)
      .post('/alogin')
      .send({ userid: 'admin@emf.com', pass: 'admin123' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/admin');
  });

  it('Admin views user list', async () => {
    UserModels.getallUser.mockResolvedValue([
      { u_id: 1, first_name: 'Rahim', last_name: 'Miah', email: 'rahim@email.com', status: 1 },
      { u_id: 2, first_name: 'Fatima', last_name: 'Begum', email: 'fatima@email.com', status: 1 }
    ]);
    const adminToken = jwt.sign({ name: 'Admin', mail: 'admin@emf.com', role: 'admin' }, process.env.JWT_SECRET);
    const app = createApp();
    const res = await request(app)
      .get('/user')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${adminToken}`]);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Rahim');
  });

  it('Admin activates shopkeeper account', async () => {
    UserModels.workeracUpdateStatus.mockResolvedValue({ affectedRows: 1 });
    const adminToken = jwt.sign({ name: 'Admin', mail: 'admin@emf.com', role: 'admin' }, process.env.JWT_SECRET);
    const app = createApp();
    const res = await request(app)
      .get('/verify-shopkeeper-account/pending@shop.com')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${adminToken}`]);
    expect(res.status).toBe(302);
    expect(UserModels.workeracUpdateStatus).toHaveBeenCalledWith('pending@shop.com');
  });

  it('Admin blocks shopkeeper account', async () => {
    UserModels.workerHoldUpdateStatus.mockResolvedValue({ affectedRows: 1 });
    const adminToken = jwt.sign({ name: 'Admin', mail: 'admin@emf.com', role: 'admin' }, process.env.JWT_SECRET);
    const app = createApp();
    const res = await request(app)
      .get('/hold-shopkeeper-account/abusive@shop.com')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${adminToken}`]);
    expect(res.status).toBe(302);
    expect(UserModels.workerHoldUpdateStatus).toHaveBeenCalledWith('abusive@shop.com');
  });
});

describe('Shopkeeper Journey', () => {
  beforeEach(() => jest.clearAllMocks());

  it('Shopkeeper registers a new account', async () => {
    UserModels.getUser.mockResolvedValue(null);
    UserModels.insertWorkerRegisterM.mockResolvedValue([{ insertId: 4 }]);
    const app = createApp();
    const res = await request(app)
      .post('/shopkeepersignup')
      .field('firstName', 'New')
      .field('lastName', 'Pharmacy')
      .field('gender', 'Male')
      .field('shopname', 'New Pharmacy')
      .field('email', 'new@pharmacy.com')
      .field('phone', '01900000000')
      .field('pass', 'shopPass123');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/shopkeeperlogin');
  });

  it('Shopkeeper adds medicine to inventory', async () => {
    UserModels.shopmedicine.mockResolvedValue([{ affectedRows: 1 }]);
    const app = createApp();
    const res = await request(app)
      .post('/add-medicine')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${shopToken}`])
      .send({
        shopemail: 'haque@pharmacy.com',
        mediname: 'Napa',
        meditype: 'Tablet',
        medistrength: '500mg',
        medigeneric: 'Paracetamol',
        medicompany: 'Beximco',
        medistock: 100,
        mediprice: 5.00
      });
    expect([200, 302]).toContain(res.status);
  });

  it('Shopkeeper views dashboard with inventory', async () => {
    UserModels.workermailCatchM.mockResolvedValue([{ shopname: 'Haques Pharmacy', email: 'haque@pharmacy.com' }]);
    UserModels.getaService.mockResolvedValue([{ id: 1, name: 'Napa' }]);
    UserModels.getMedicine.mockResolvedValue([{ id: 1, mediname: 'Napa', stock: 100, price: 5.00 }]);
    const app = createApp();
    const res = await request(app)
      .get('/shopkeeperdesh')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${shopToken}`]);
    expect(res.status).toBe(200);
  });

  it('Shopkeeper logs out', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/shopkeeperlogout')
      .set('Cookie', [`${process.env.COOKIE_NAME}=${shopToken}`]);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/shopkeeperlogin');
  });
});
