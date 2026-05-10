const jwt = require('jsonwebtoken');
const UserModels = require('../models/UserModels');

require('dotenv').config();

const verifyToken = (req) => {
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

const getRedirectPath = (role) => {
  const paths = {
    user: '/login',
    shopkeeper: '/shopkeeperlogin',
    admin: '/admin',
  };
  return paths[role] || '/login';
};

const requireAuth = (req, res, next) => {
  const decoded = verifyToken(req);
  if (!decoded) {
    const redirectPath = getRedirectPath(req.targetRole || 'user');
    return res.redirect(redirectPath);
  }
  req.user = decoded;
  next();
};

const requireUser = (req, res, next) => {
  req.targetRole = 'user';
  const decoded = verifyToken(req);

  if (!decoded) {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.redirect('/login');
  }

  if (decoded.role !== 'user') {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.redirect(getRedirectPath(decoded.role));
  }

  req.user = decoded;
  next();
};

const requireShopkeeper = (req, res, next) => {
  req.targetRole = 'shopkeeper';
  const decoded = verifyToken(req);

  if (!decoded) {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.redirect('/shopkeeperlogin');
  }

  if (decoded.role !== 'shopkeeper') {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.redirect(getRedirectPath(decoded.role));
  }

  req.user = decoded;
  next();
};

const requireAdmin = (req, res, next) => {
  req.targetRole = 'admin';
  const decoded = verifyToken(req);

  if (!decoded) {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.redirect('/admin');
  }

  if (decoded.role !== 'admin') {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.redirect(getRedirectPath(decoded.role));
  }

  req.user = decoded;
  next();
};

const checkUser = (req, res, next) => {
  const decoded = verifyToken(req);

  if (!decoded) {
    res.locals.user = null;
    res.locals.role = null;
    return next();
  }

  const loadUser = async () => {
    try {
      if (decoded.role === 'user') {
        const user = await UserModels.mailCatchM(decoded.mail);
        res.locals.user = user;
      } else if (decoded.role === 'shopkeeper') {
        const shopkeeper = await UserModels.workermailCatchM(decoded.mail);
        res.locals.user = shopkeeper;
      } else if (decoded.role === 'admin') {
        res.locals.user = { userid: decoded.mail };
      }
      res.locals.role = decoded.role;
      next();
    } catch (err) {
      res.locals.user = null;
      res.locals.role = null;
      next();
    }
  };

  loadUser();
};

const checkCurrentLogin = (req, res, next) => {
  const decoded = verifyToken(req);

  if (decoded) {
    return res.redirect('/');
  }

  next();
};

const redirectLoggedIn = (req, res, next) => {
  const decoded = verifyToken(req);

  if (decoded) {
    return res.redirect('/');
  }

  next();
};

const redirectIfLoggedInAsRole = (targetRole) => (req, res, next) => {
  const decoded = verifyToken(req);

  if (decoded && decoded.role === targetRole) {
    return res.redirect(`/${targetRole === 'user' ? '' : targetRole}`);
  }

  next();
};

module.exports = {
  verifyToken,
  requireAuth,
  requireUser,
  requireShopkeeper,
  requireAdmin,
  checkUser,
  checkCurrentLogin,
  redirectLoggedIn,
  redirectIfLoggedInAsRole,
  getRedirectPath,
};