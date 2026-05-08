const jwt = require('jsonwebtoken');
const UserModels = require('../models/UserModels');

require('dotenv').config();

/* ==== Require auth - any logged in user ==== */
const requireAuth = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.clearCookie(process.env.COOKIE_NAME);
        res.redirect('/login');
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

/* ==== Require user role ==== */
const requireUser = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err || decodedToken.role !== 'user') {
        res.clearCookie(process.env.COOKIE_NAME);
        res.redirect('/login');
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

/* ==== Require shopkeeper role ==== */
const requireShopkeeper = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err || decodedToken.role !== 'shopkeeper') {
        res.clearCookie(process.env.COOKIE_NAME);
        res.redirect('/shopkeeperlogin');
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/shopkeeperlogin');
  }
};

/* ==== Require admin role ==== */
const requireAdmin = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err || decodedToken.role !== 'admin') {
        res.clearCookie(process.env.COOKIE_NAME);
        res.redirect('/admin');
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/admin');
  }
};

/* ===== check user for templates ====== */
const checkUser = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.locals.role = null;
        next();
      } else {
        if (decodedToken.role === 'user') {
          const user = await UserModels.mailCatchM(decodedToken.mail);
          res.locals.user = user;
        } else if (decodedToken.role === 'shopkeeper') {
          const shopkeeper = await UserModels.workermailCatchM(decodedToken.mail);
          res.locals.user = shopkeeper;
        } else if (decodedToken.role === 'admin') {
          res.locals.user = { userid: decodedToken.mail };
        }
        res.locals.role = decodedToken.role;
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.locals.role = null;
    next();
  }
};

/* ==== check login - redirect if already logged in ==== */
const checkCurrentLogin = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (!err) {
        res.redirect('/');
      } else {
        next();
      }
    });
  } else {
    next();
  }
};

/* ==== redirect if already logged in (for login pages) ==== */
const redirectLoggedIn = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token) {
    next();
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        next();
      } else {
        res.redirect('/');
      }
    });
  }
};

// exports function
module.exports = { requireAuth, requireUser, requireShopkeeper, requireAdmin, checkUser, checkCurrentLogin, redirectLoggedIn };
