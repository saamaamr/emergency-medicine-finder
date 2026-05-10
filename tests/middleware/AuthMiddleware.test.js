const jwt = require('jsonwebtoken');

jest.mock('../../models/UserModels', () => ({
  mailCatchM: jest.fn(),
  workermailCatchM: jest.fn(),
}));

const UserModels = require('../../models/UserModels');
const {
  requireUser,
  requireShopkeeper,
  requireAdmin,
  checkUser,
  checkCurrentLogin,
  redirectLoggedIn,
} = require('../../middleware/AuthMiddleware');

describe('AuthMiddleware', () => {
  let req;
  let res;
  let next;

  const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  };

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      locals: {},
      redirect: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  /* ========== requireUser ========== */

  describe('requireUser', () => {
    it('should call next() if valid user token', () => {
      const token = createToken({ name: 'John', mail: 'john@test.com', role: 'user' });
      req.cookies[process.env.COOKIE_NAME] = token;

      requireUser(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.role).toBe('user');
      expect(next).toHaveBeenCalled();
    });

    it('should redirect to login if no token', () => {
      requireUser(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to login if token has wrong role', () => {
      const token = createToken({ name: 'Shop', mail: 'shop@test.com', role: 'shopkeeper' });
      req.cookies[process.env.COOKIE_NAME] = token;

      requireUser(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to login if token is expired', () => {
      const expiredToken = jwt.sign(
        { name: 'John', mail: 'john@test.com', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );
      req.cookies[process.env.COOKIE_NAME] = expiredToken;

      requireUser(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });
  });

  /* ========== requireShopkeeper ========== */

  describe('requireShopkeeper', () => {
    it('should call next() if valid shopkeeper token', () => {
      const token = createToken({ name: 'Shop', mail: 'shop@test.com', role: 'shopkeeper' });
      req.cookies[process.env.COOKIE_NAME] = token;

      requireShopkeeper(req, res, next);
      expect(req.user.role).toBe('shopkeeper');
      expect(next).toHaveBeenCalled();
    });

    it('should redirect to shopkeeper login if no token', () => {
      requireShopkeeper(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/shopkeeperlogin');
    });

    it('should redirect if user tries to access shopkeeper route', () => {
      const token = createToken({ name: 'John', mail: 'john@test.com', role: 'user' });
      req.cookies[process.env.COOKIE_NAME] = token;

      requireShopkeeper(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/shopkeeperlogin');
    });
  });

  /* ========== requireAdmin ========== */

  describe('requireAdmin', () => {
    it('should call next() if valid admin token', () => {
      const token = createToken({ name: 'Admin', mail: 'admin@emf.com', role: 'admin' });
      req.cookies[process.env.COOKIE_NAME] = token;

      requireAdmin(req, res, next);
      expect(req.user.role).toBe('admin');
      expect(next).toHaveBeenCalled();
    });

    it('should redirect to admin if no token', () => {
      requireAdmin(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/admin');
    });

    it('should redirect if non-admin token', () => {
      const token = createToken({ name: 'John', mail: 'john@test.com', role: 'user' });
      req.cookies[process.env.COOKIE_NAME] = token;

      requireAdmin(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/admin');
    });
  });

  /* ========== checkUser ========== */

  describe('checkUser', () => {
    it('should set res.locals.user and role for logged-in user', async () => {
      const mockUser = [{ u_id: 1, first_name: 'John', email: 'john@test.com' }];
      UserModels.mailCatchM.mockResolvedValue(mockUser);

      const token = createToken({ name: 'John', mail: 'john@test.com', role: 'user' });
      req.cookies[process.env.COOKIE_NAME] = token;

      await checkUser(req, res, next);

      expect(res.locals.role).toBe('user');
      expect(res.locals.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should set user to null if no token', async () => {
      await checkUser(req, res, next);
      expect(res.locals.user).toBeNull();
      expect(res.locals.role).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('should set user to null for invalid token', async () => {
      req.cookies[process.env.COOKIE_NAME] = 'invalid-token';

      await checkUser(req, res, next);
      expect(res.locals.user).toBeNull();
      expect(res.locals.role).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('should load shopkeeper data for shopkeeper role', async () => {
      const mockShopkeeper = [{ w_id: 1, shopname: 'Test Shop', email: 'shop@test.com' }];
      UserModels.workermailCatchM.mockResolvedValue(mockShopkeeper);

      const token = createToken({ name: 'Test Shop', mail: 'shop@test.com', role: 'shopkeeper' });
      req.cookies[process.env.COOKIE_NAME] = token;

      await checkUser(req, res, next);
      expect(res.locals.role).toBe('shopkeeper');
      expect(res.locals.user).toEqual(mockShopkeeper);
    });

    it('should set admin data for admin role', async () => {
      const token = createToken({ name: 'Admin', mail: 'admin@emf.com', role: 'admin' });
      req.cookies[process.env.COOKIE_NAME] = token;

      await checkUser(req, res, next);
      expect(res.locals.role).toBe('admin');
      expect(res.locals.user).toEqual({ userid: 'admin@emf.com' });
    });
  });

  /* ========== checkCurrentLogin ========== */

  describe('checkCurrentLogin', () => {
    it('should redirect to home if already logged in', () => {
      const token = createToken({ name: 'John', mail: 'john@test.com', role: 'user' });
      req.cookies[process.env.COOKIE_NAME] = token;

      checkCurrentLogin(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/');
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if not logged in', () => {
      checkCurrentLogin(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should call next() if token is expired', () => {
      const expiredToken = jwt.sign(
        { name: 'John', mail: 'john@test.com', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );
      req.cookies[process.env.COOKIE_NAME] = expiredToken;

      checkCurrentLogin(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  /* ========== redirectLoggedIn ========== */

  describe('redirectLoggedIn', () => {
    it('should redirect to home if already logged in', () => {
      const token = createToken({ name: 'John', mail: 'john@test.com', role: 'user' });
      req.cookies[process.env.COOKIE_NAME] = token;

      redirectLoggedIn(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should call next() if not logged in', () => {
      redirectLoggedIn(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should call next() if no cookie exists', () => {
      redirectLoggedIn(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
