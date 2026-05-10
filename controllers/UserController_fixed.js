const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const UserModels = require('../models/UserModels');
const { checkCurrentLogin, requireUser, requireShopkeeper, requireAdmin } = require('../middleware/AuthMiddleware');

require('dotenv').config();

const maxAge = 3 * 24 * 60 * 60 * 1000;

/*===== Mail Confirmation =====*/
const { sendMail } = require('../utils/emailUtils');
/*==== Controlers ====*/
const UserController = {

  getHome: async (req, res) => {
    const allService = await UserModels.getaService()
    const uId = req.user ? req.user.mail : null;
    const userData = uId ? await UserModels.getUser(uId) : null
    res.render('pages/home', { uId, allService, userData })
  },
  getAbout: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const userData = uId ? await UserModels.getUser(uId) : null

    res.render('pages/about', { uId, userData })
  },
  getContact: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const userData = uId ? await UserModels.getUser(uId) : null

    res.render('pages/contact', { uId, userData })
  },
  getOffer: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const userData = uId ? await UserModels.getUser(uId) : null

    res.render('pages/offer', { uId, userData })
  },
  // Admin Related
  getAdmin: async (req, res) => {
    const allUser = await UserModels.getallUser()
    const allService = await UserModels.getaService()
    const allShopkeeper = await UserModels.getallWorker()
    const adminData = req.user ? req.user.mail : null;

    res.render('pages/admin', { allUser, allService, allShopkeeper, adminData })
  },
  getBooked: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const userData = uId ? await UserModels.getUser(uId) : null;
    const userBooking = uId ? await UserModels.getUserBooking(uId) : null;

    res.render('pages/booked', { uId, userData, userBooking })
  },
  getUser: async (req, res) => {
    const allUser = await UserModels.getallUser()
    res.render('pages/user', { allUser })
  },

  getShopkeeper: async (req, res) => {
    const allShopkeeper = await UserModels.getallWorker()
    res.render('pages/shopkeeper', { allShopkeeper })
  },

  getMediReqData: async (req, res) => {

    const uId = req.user ? req.user.mail : null;
    const shopkeeperData = uId ? await UserModels.workermailCatchM(uId) : null;
    const allMedicine = uId ? await UserModels.getMedicineReq(uId) : null

    res.render('pages/servicereq', { uId, shopkeeperData, allMedicine })

  },

  getShopkeeperDesh: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const shopkeeperData = uId ? await UserModels.workermailCatchM(uId) : null;
    const allService = await UserModels.getaService()
    const allMedicine = uId ? await UserModels.getMedicine(uId) : null
    res.render('pages/shopkeeperdesh', { uId, allService, shopkeeperData, allMedicine })
  },


  getServiceData: async (req, res) => {
    const allService = await UserModels.getaService()
    res.render('pages/service', { allService })
  },



  mediData: async (req, res) => {
    try {
      const {
        mediname, meditype, medistrength, medigeneric, medicompany
      } = req.body;
      const servie = await UserModels.medicine(mediname, meditype, medistrength, medigeneric, medicompany);
      if (servie.errno) {
        res.send('Something went wrong')
      } else {
        res.redirect('/service')
      }
    } catch (e) {

      res.send('Wrong')
    }
  },

  medicineData: async (req, res) => {
    try {
      const {
        shopemail, mediname, meditype, medistrength, medigeneric, medicompany, medistock, mediprice
      } = req.body;
      const servie = await UserModels.shopmedicine(shopemail, mediname, meditype, medistrength, medigeneric, medicompany, medistock, mediprice);
      if (servie.errno) {
        res.send('Something went wrong')
      } else {
        res.redirect('/workers')
      }
    } catch (e) {
      res.send('Wrong')
    }
  },

  /* User login controller */
  loginC: async (req, res) => {
    try {
      const { email, pass } = req.body;

      const errors = validationResult(req).formatWith((error) => error.msg);

      if (!errors.isEmpty()) {
        return res.render('pages/login', {
          error: errors.mapped(),
          value: { email, pass },
        });
      }
      const user = await UserModels.mailCatchM(email);
      if (!user || user.length === 0) {
        return res.render('pages/login', { auth: true });
      }

      const userName = user[0].first_name;
      const userMail = user[0].email;
      const password = user[0].pass;

      if (user[0].u_id !== '') {
        const isValidPassword = await bcrypt.compare(pass, password);
        if (isValidPassword) {
          if (user[0].status == 1) {
              const token = jwt.sign(
                {
                  name: userName,
                  mail: userMail,
                  role: 'user'
                },
                process.env.JWT_SECRET,
                { expiresIn: maxAge },
              )

              res.clearCookie(process.env.COOKIE_NAME);
              res.cookie(process.env.COOKIE_NAME, token, { maxAge, httpOnly: true, signed: true });

              const allService = await UserModels.getaService()
              const userData = await UserModels.getUser(userMail)

              res.render('pages/home', { uId: userMail, allService, userData })

          } else {
            res.send('Active your account.');
          }
        } else {
          res.render('pages/login', { auth: true });
        }
      } else {
        res.render('pages/login', { auth: true });
      }
    } catch (err) {
      res.render('pages/login', {
        auth: true,
        data: {
          email: req.body.email,
        },
        errors: {
          common: {
            msg: err.message,
          },
        }
      });
     }

  /* Shopkeeper login controller */
  shopkeeperloginC: async (req, res) => {
    try {
      const {
        email, pass,
      } = req.body;

      if (email && pass) {
        const login = await UserModels.workermailCatchM(email);
        if (login.length > 0) {
          for (let i = 0; i < login.length; i++) {
            const validPass = await bcrypt.compare(pass, login[i].pass);
            if (validPass) {
              if (login[i].status == 1) {
                const userMail = login[i].email;
                const shopName = login[i].shopname;

                const token = jwt.sign(
                  {
                    name: shopName,
                    mail: userMail,
                    role: 'shopkeeper'
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: maxAge },
                )

                res.clearCookie(process.env.COOKIE_NAME);
                res.cookie(process.env.COOKIE_NAME, token, { maxAge, httpOnly: true, signed: true });

                res.redirect('/shopkeeper');
                return;
              } else {
                res.send('Your account not active.');
                return;
              }
            }
          }
          res.send('Incorrect Password');
        } else {
          res.send('Incorrect Email Address');
        }
        res.end();
      } else {
        res.send('Please enter your email, password. If you have no account please sign up.')
        res.end();
      }
     } catch (e) {
       res.send('Wrong')
     }
   
