const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const UserModels = require('../models/UserModels');
const OTPService = require('../services/OTPService');

require('dotenv').config();

const USER_SESSION_HOURS = parseInt(process.env.USER_SESSION_HOURS) || 3;
const SHOPKEEPER_SESSION_HOURS = parseInt(process.env.SHOPKEEPER_SESSION_HOURS) || 24;
const ADMIN_SESSION_HOURS = parseInt(process.env.ADMIN_SESSION_HOURS) || 8;
const sessionExpiryHours = parseInt(process.env.SESSION_EXPIRY_HOURS) || 8;

const maxAgeUser = USER_SESSION_HOURS * 60 * 60 * 1000;
const maxAgeShopkeeper = SHOPKEEPER_SESSION_HOURS * 60 * 60 * 1000;
const maxAgeAdmin = ADMIN_SESSION_HOURS * 60 * 60 * 1000;

const hashBrowserKey = (browserKey) => {
  return crypto.createHash('sha256').update(browserKey + (process.env.BROWSER_SECRET || 'default_secret')).digest('hex');
};

const getExpiryTime = () => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + sessionExpiryHours);
  return expiry;
};

const getDeviceInfo = (req) => {
  return req.headers['user-agent'] || 'Unknown Device';
};

const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip || 'Unknown';
};

/*= ==== Mail Confirmation ===== */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});
//

async function sendMail(toMail, subject, textMessage, htmlMessage) {
  // send mail with defined transport object
  const results = await transporter.sendMail({
    from: 'EMF Service 🔓📨 <emflocal0@gmail.com>',
    to: toMail,
    subject,
    text: textMessage,
    html: htmlMessage,
  })
  return results
}
/*= === Controlers ==== */
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
    if (!req.user || req.user.role !== 'admin') {
      return res.render('pages/adminlogin')
    }
    const allUser = await UserModels.getallUser()
    const allService = await UserModels.getaService()
    const allShopkeeper = await UserModels.getallWorker()
    const adminData = req.user ? req.user.mail : null;

    res.render('pages/admin', {
      allUser, allService, allShopkeeper, adminData,
    })
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
    res.render('pages/shopkeeperdesh', {
      uId, allService, shopkeeperData, allMedicine,
    })
  },

  getShopProfile: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const shopkeeperData = uId ? await UserModels.workermailCatchM(uId) : null;
    res.render('pages/shopprofile', { uId, shopkeeperData });
  },

  updateShopProfile: async (req, res) => {
    try {
      const { firstName, lastName, gender, phone, house, road, division, zila, upazila, lat, lng } = req.body;
      const email = req.user.mail;
      
      let propic = null;
      if (req.file) {
        propic = '/uploads/' + req.file.filename;
      }
      
      await UserModels.updateWorkerProfile(firstName, lastName, gender, phone, house, road, division, zila, upazila, lat || null, lng || null, propic, email);
      res.redirect('/shopprofile?updated=true');
    } catch (err) {
      console.error('Profile update error:', err);
      res.redirect('/shopprofile?error=true');
    }
  },

  getServiceData: async (req, res) => {
    const allService = await UserModels.getaService()
    res.render('pages/service', { allService })
  },

  mediData: async (req, res) => {
    try {
      const {
        mediname, meditype, medistrength, medigeneric, medicompany,
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
        mediname, meditype, medistrength, medigeneric, medicompany, medistock, mediprice,
      } = req.body;
      const shopemail = req.user.mail;
      const servie = await UserModels.shopmedicine(shopemail, mediname, meditype, medistrength, medigeneric, medicompany, medistock, mediprice);
      if (servie.errno) {
        res.send('Something went wrong')
      } else {
        res.redirect('/shopkeeperdesh?added=true')
      }
    } catch (e) {
      res.redirect('/shopkeeperdesh?error=true')
    }
  },

  updateStock: async (req, res) => {
    try {
      const { shopemail, mediname, updateType, quantity } = req.body;
      const qty = parseInt(quantity);
      
      if (updateType === 'decrease') {
        const result = await UserModels.updateShopMedicineStock(shopemail, mediname, qty);
        if (result.affectedRows === 0) {
          res.redirect('/shopkeeperdesh?error=true');
          return;
        }
      } else {
        await UserModels.addShopMedicineStock(shopemail, mediname, qty);
      }
      
      res.redirect('/shopkeeperdesh?updated=true');
    } catch (err) {
      console.error('Stock update error:', err);
      res.redirect('/shopkeeperdesh?error=true');
    }
  },

  /* User login controller */
  loginC: async (req, res) => {
    try {
      const { email, pass, browserKey } = req.body;

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
            if (browserKey) {
              const hashedBrowserKey = hashBrowserKey(browserKey);
              const existingSession = await UserModels.getActiveSession(userMail, 'user');

              if (existingSession) {
                if (existingSession.browser_key !== hashedBrowserKey) {
                  return res.render('pages/login', {
                    auth: true,
                    error: 'You are already logged in on another browser. Please logout from that browser first.',
                  });
                } else {
                  await UserModels.deleteSession(userMail, 'user');
                }
              }

              await UserModels.createSession(
                userMail,
                'user',
                hashedBrowserKey,
                getDeviceInfo(req),
                getClientIP(req),
                getExpiryTime()
              );
            }

            const token = jwt.sign(
              {
                name: userName,
                mail: userMail,
                role: 'user',
              },
              process.env.JWT_SECRET,
              { expiresIn: maxAgeUser },
            )

            res.clearCookie(process.env.COOKIE_NAME);
            res.cookie(process.env.COOKIE_NAME, token, { maxAge: maxAgeUser, httpOnly: true, signed: true, encode: String, path: '/' });

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
        },
      });
    }
  },
  /* Shopkeeper login controller */
  shopkeeperloginC: async (req, res) => {
    try {
      const {
        email, pass, browserKey,
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
                const phone = login[i].phone;

                const verification = await UserModels.checkShopkeeperVerification(email);
                if (!verification) {
                  res.send('Account verification issue. Please contact support.');
                  return;
                }

                if (!verification.email_verified || !verification.phone_verified) {
                  // Sequential OTP: send only email first
                  const result = await OTPService.sendEmailOTPOnly(email, phone, 'Login');
                  if (!result.success) {
                    res.send('Failed to send OTP. Please try again.');
                    return;
                  }

                  await UserModels.createShopkeeperOTP(email, result.hashedOTP, result.expiresAt, 'login');

                  return res.render('pages/shopkeeper-otp-verify', {
                    email,
                    purpose: 'login',
                    message: `OTP sent to ${email}. You will verify phone after email.`,
                    step: 'email',
                    emailVerified: false,
                  });
                }

                if (browserKey) {
                  const hashedBrowserKey = hashBrowserKey(browserKey);
                  const existingSession = await UserModels.getActiveSession(userMail, 'shopkeeper');

                  if (existingSession) {
                    if (existingSession.browser_key !== hashedBrowserKey) {
                      return res.send('You are already logged in on another browser. Please logout from that browser first.');
                    } else {
                      await UserModels.deleteSession(userMail, 'shopkeeper');
                    }
                  }

                  await UserModels.createSession(
                    userMail,
                    'shopkeeper',
                    hashedBrowserKey,
                    getDeviceInfo(req),
                    getClientIP(req),
                    getExpiryTime()
                  );
                }

                const token = jwt.sign(
                  {
                    name: shopName,
                    mail: userMail,
                    role: 'shopkeeper',
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: maxAgeShopkeeper },
                )

                res.clearCookie(process.env.COOKIE_NAME);
                res.cookie(process.env.COOKIE_NAME, token, { maxAge: maxAgeShopkeeper, httpOnly: true, signed: true, encode: String, path: '/' });

                res.redirect('/shopkeeperdesh');
                return;
              }
              res.send('Your account not active.');
              return;
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
  },

  verifyShopkeeperOTPC: async (req, res) => {
    try {
      const { email, otp, purpose } = req.body;

      if (!email || !otp) {
        return res.render('pages/shopkeeper-otp-verify', {
          email,
          purpose,
          error: 'Please enter the OTP.',
        });
      }

      const otpRecord = await UserModels.getShopkeeperOTP(email);
      if (!otpRecord) {
        return res.render('pages/shopkeeper-otp-verify', {
          email,
          purpose,
          error: 'OTP expired or not found. Please request a new OTP.',
        });
      }

      const attempts = await UserModels.getOTPAttempts(email);
      if (attempts >= OTPService.maxAttempts) {
        await UserModels.deleteShopkeeperOTP(email);
        return res.render('pages/shopkeeper-otp-verify', {
          email,
          purpose,
          error: 'Too many attempts. Please request a new OTP.',
        });
      }

      const isValid = OTPService.verify(otp, otpRecord.otp_hash);
      if (!isValid) {
        await UserModels.incrementOTPAttempts(email);
        return res.render('pages/shopkeeper-otp-verify', {
          email,
          purpose,
          error: `Invalid OTP. ${OTPService.maxAttempts - attempts - 1} attempts remaining.`,
        });
      }

      await UserModels.deleteShopkeeperOTP(email);

      // Sequential OTP verification: email first, then phone
      if (purpose === 'signup' || purpose === 'login') {
        // First step: verify email OTP
        await UserModels.updateShopkeeperVerification(email, 'email', true);

        // Get phone number for next step
        const login = await UserModels.workermailCatchM(email);
        if (!login || login.length === 0) {
          return res.render('pages/shopkeeper-otp-verify', {
            email,
            purpose: 'signup',
            error: 'User not found.',
          });
        }

        const phone = login[0].phone;

        if (purpose === 'signup') {
          // For signup: send phone OTP now
          const phoneResult = await OTPService.sendPhoneOTPOnly(email, phone, 'Sign Up');
          if (!phoneResult.success) {
            // If SMS fails, skip phone verification for signup (email only)
            return res.redirect('/shopkeeperlogin?verified=true');
          }

          await UserModels.createShopkeeperOTP(email, phoneResult.hashedOTP, phoneResult.expiresAt, 'signup_phone');

          return res.render('pages/shopkeeper-otp-verify', {
            email,
            purpose: 'signup_phone',
            message: `Email OTP verified! Phone OTP sent to ${phone}.`,
            step: 'phone',
            emailVerified: true,
          });
        }

        if (purpose === 'login') {
          // For login: send phone OTP now
          const phoneResult = await OTPService.sendPhoneOTPOnly(email, phone, 'Login');
          if (!phoneResult.success) {
            return res.render('pages/shopkeeper-otp-verify', {
              email,
              purpose: 'login',
              error: 'Email verified, but failed to send phone OTP.',
            });
          }

          await UserModels.createShopkeeperOTP(email, phoneResult.hashedOTP, phoneResult.expiresAt, 'login_phone');

          return res.render('pages/shopkeeper-otp-verify', {
            email,
            purpose: 'login_phone',
            message: `Email verified! Phone OTP sent to ${phone}.`,
            step: 'phone',
            emailVerified: true,
          });
        }
      }

      if (purpose === 'signup_phone') {
        await UserModels.updateShopkeeperVerification(email, 'phone', true);
        return res.redirect('/shopkeeperlogin?verified=true');
      }

      if (purpose === 'login_phone') {
        await UserModels.updateShopkeeperVerification(email, 'phone', true);

        const login = await UserModels.workermailCatchM(email);
        if (!login || login.length === 0) {
          return res.redirect('/shopkeeperlogin');
        }

        const userMail = login[0].email;
        const shopName = login[0].shopname;
        const browserKey = req.body.browserKey;

        if (browserKey) {
          const hashedBrowserKey = hashBrowserKey(browserKey);
          const existingSession = await UserModels.getActiveSession(userMail, 'shopkeeper');

          if (existingSession) {
            if (existingSession.browser_key !== hashedBrowserKey) {
              return res.send('You are already logged in on another browser. Please logout from that browser first.');
            } else {
              await UserModels.deleteSession(userMail, 'shopkeeper');
            }
          }

          await UserModels.createSession(
            userMail,
            'shopkeeper',
            hashedBrowserKey,
            getDeviceInfo(req),
            getClientIP(req),
            getExpiryTime()
          );
        }

        const token = jwt.sign(
          {
            name: shopName,
            mail: userMail,
            role: 'shopkeeper',
          },
          process.env.JWT_SECRET,
          { expiresIn: maxAgeShopkeeper },
        );

        res.clearCookie(process.env.COOKIE_NAME);
        res.cookie(process.env.COOKIE_NAME, token, { maxAge: maxAgeShopkeeper, httpOnly: true, signed: true, encode: String, path: '/' });

        return res.redirect('/shopkeeperdesh');
      }

      res.redirect('/shopkeeperlogin');
    } catch (err) {
      console.error('OTP verify error:', err);
      res.render('pages/shopkeeper-otp-verify', {
        email: req.body.email,
        purpose: req.body.purpose,
        error: 'Verification failed. Please try again.',
      });
    }
  },

  resendShopkeeperOTPC: async (req, res) => {
    try {
      const { email, purpose } = req.body;

      if (!email) {
        return res.redirect('/shopkeeperlogin');
      }

      const login = await UserModels.workermailCatchM(email);
      if (!login || login.length === 0) {
        return res.redirect('/shopkeeperlogin');
      }

      const phone = login[0].phone;
      const purposeType = purpose === 'signup' || purpose === 'login' ? 'email' : 'phone';
      const result = purposeType === 'email'
        ? await OTPService.sendEmailOTPOnly(email, phone, purpose === 'signup' ? 'Sign Up' : 'Login')
        : await OTPService.sendPhoneOTPOnly(email, phone, purpose === 'signup' ? 'Sign Up' : 'Login');

      if (!result.success) {
        return res.render('pages/shopkeeper-otp-verify', {
          email,
          purpose,
          error: 'Failed to send OTP. Please try again.',
        });
      }

      await UserModels.createShopkeeperOTP(email, result.hashedOTP, result.expiresAt, purpose);

      return res.render('pages/shopkeeper-otp-verify', {
        email,
        purpose,
        message: purposeType === 'email'
          ? `New OTP sent to ${email}.`
          : `New OTP sent to ${phone}.`,
        step: purposeType,
        emailVerified: purposeType === 'phone',
      });
    } catch (err) {
      console.error('Resend OTP error:', err);
      res.redirect('/shopkeeperlogin');
    }
  },

  getShopkeeperOTPVerify: async (req, res) => {
    const { email, purpose } = req.query;
    if (!email || !purpose) {
      return res.redirect('/shopkeeperlogin');
    }
    res.render('pages/shopkeeper-otp-verify', { email, purpose, error: null, message: null });
  },

  /* ====== New User register  Controller  ====== */

  registerC: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const user = uId ? await UserModels.getUser(uId) : null
    res.render('pages/signup', { uId, user });
  },
  /* ====== New Shopkeeper register  Controller  ====== */
  shopkeeperRegisterC: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const user = uId ? await UserModels.getUser(uId) : null
    res.render('pages/shopkeepersignup', { uId, user });
  },

  /* ====== User upadate  Controller  ====== */

  userUpadateC: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const user = uId ? await UserModels.getUser(uId) : null
    res.render('pages/edituser', { uId, user });
  },

  mediUpadateC: async (req, res) => {
    const wId = req.user ? req.user.mail : null;
    const shopkeeperData = wId ? await UserModels.workermailCatchM(wId) : null;
    const allMedicine = wId ? await UserModels.getMedicine(wId) : null;
    const allService = await UserModels.getaService()
    res.render('pages/mediupdate', {
      wId, shopkeeperData, allMedicine, allService,
    });
  },
  mediReqC: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const reqId = req.params.service_id;
    const user = uId ? await UserModels.getUser(uId) : null;
    const mediData = reqId ? await UserModels.getRequestMedicine(reqId) : null

    res.render('pages/request', {
      uId, user, reqId, mediData,
    });
  },

  /* ====== New login Controller  ====== */

  newlogin: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const userData = uId ? await UserModels.getUser(uId) : null;

    res.render('pages/login', { uId, userData });
  },

  shopkeeperlogin: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const user = uId ? await UserModels.getUser(uId) : null
    res.render('pages/shopkeeperlogin', { uId, user });
  },

  adminLoginData: async (req, res) => {
    try {
      const {
        userid, pass, browserKey,
      } = req.body;

      if (userid && pass) {
        const alogin = await UserModels.getAdmin(userid);

        if (alogin.length > 0) {
          const validPass = await bcrypt.compare(pass, alogin[0].pass);
          if (validPass) {
            if (browserKey) {
              const hashedBrowserKey = hashBrowserKey(browserKey);
              const existingSession = await UserModels.getActiveSession(userid, 'admin');

              if (existingSession) {
                if (existingSession.browser_key !== hashedBrowserKey) {
                  return res.send('You are already logged in on another browser. Please logout from that browser first.');
                } else {
                  await UserModels.deleteSession(userid, 'admin');
                }
              }

              await UserModels.createSession(
                userid,
                'admin',
                hashedBrowserKey,
                getDeviceInfo(req),
                getClientIP(req),
                getExpiryTime()
              );
            }

            const token = jwt.sign(
              {
                name: 'Admin',
                mail: userid,
                role: 'admin',
              },
              process.env.JWT_SECRET,
              { expiresIn: maxAgeAdmin },
            )

            res.clearCookie(process.env.COOKIE_NAME);
            res.cookie(process.env.COOKIE_NAME, token, { maxAge: maxAgeAdmin, httpOnly: true, signed: true, encode: String, path: '/' });

            res.redirect('/admin');
            return;
          } else {
            res.send('Incorrect Password');
            return;
          }
        } else {
          res.send('Incorrect User ID');
          return;
        }
      } else {
        res.send('Please enter your Id, password.')
      }
    } catch (e) {
      res.send('Wrong')
    }
  },

  /* ====== Profile Controller  ====== */
  profile: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const userData = uId ? await UserModels.getUser(uId) : null

    res.render('pages/userprofile', { uId, userData });
  },

  userRequestData: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const userData = uId ? await UserModels.getUser(uId) : null
    const mediData = uId ? await UserModels.getMedicineUserReq(uId) : null
    res.render('pages/userreqest', { uId, userData, mediData });
  },

  /* ====== Register controller ====== */
  insertRegisterC: async (req, res) => {
    try {
      const {
        firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass,
      } = req.body;
      const errors = validationResult(req).formatWith((error) => error.msg);
      const images = req.files || {};
      const propicFilename = images.propic && images.propic[0] ? images.propic[0].filename : 'default-user.png';

      const emailExists = await UserModels.checkEmailAcrossRoles(email);
      if (emailExists) {
        return res.render('pages/signup', {
          error: { email: 'This email is already registered. Please use a different email or login.' },
          value: { firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, pass },
        });
      }

      if (!errors.isEmpty()) {
        return res.render('pages/signup', {
          error: errors.mapped(),
          value: {
            firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, pass,
          },
        });
      }
      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.insertRegisterM(
        firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, hashPassword,
      );

      const subject = 'EMF Service active account';
      const textMessage = 'EMF Service account verify'
      const activeBtn = `
      <div style="padding: 0px 20px;margin-left: 8px;text-align: center;">
      <h4>Wellcome  ${firstName} ${lastName}.<h4>
      <p>If you are sinup for EMF Service.<p> <br>
      <p>Please EMF Service account verify. Othewise ignore the mail. <p>
      </div>
      <div>
      <a style="cursor: pointer;" href="${process.env.BASE_URL}/verify-account/${registerData[0].insertId}">
      <button style="padding: 0px 20px;
      border-radius: 8px;
      background-color: #188bde;
      border : none;
      font-size: 15px;
      font-weight: 700;
      line-height: 36px;
      color: #FFFFFF;
      margin-left: 8px;
      text-align: center;
      cursor: pointer;">
      Active account</button></a>
      </div>
      `
      sendMail(email, subject, textMessage, activeBtn)
      res.redirect('/login')
    } catch (err) {
      return res.render('pages/signup', { registerFail: true });
    }
  },

  /* ====== Shopkeeper Register controller ====== */
  insertShopkeeperRegisterC: async (req, res) => {
    try {
      const {
        firstName, lastName, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass,
      } = req.body;
      const images = req.files || {};
      const propicFilename = images.propic && images.propic[0] ? images.propic[0].filename : 'default-shop.png';
      const nid1Filename = images.nid1 && images.nid1[0] ? images.nid1[0].filename : 'default-nid.jpg';
      const nid2Filename = images.nid2 && images.nid2[0] ? images.nid2[0].filename : 'default-nid.jpg';

      const emailExists = await UserModels.checkEmailAcrossRoles(email);
      if (emailExists) {
        return res.render('pages/shopkeepersignup', {
          error: { email: 'This email is already registered. Please use a different email or login.' },
          value: { firstName, lastName, gender, shopname, email, phone, house, road, division, zila, upazila },
        });
      }

      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.insertWorkerRegisterM(
        firstName, lastName, gender, shopname, email, phone, propicFilename, nid1Filename, nid2Filename, house, road, division, zila, upazila, lat, lng, hashPassword,
      );

      // Send only email OTP first (sequential verification: email -> phone)
      const result = await OTPService.sendEmailOTPOnly(email, phone, 'Sign Up');
      if (!result.success) {
        return res.render('pages/shopkeepersignup', {
          error: { common: 'Registration succeeded but failed to send OTP. Please try resend OTP after login.' },
          value: { firstName, lastName, gender, shopname, email, phone, house, road, division, zila, upazila },
        });
      }

      await UserModels.createShopkeeperOTP(email, result.hashedOTP, result.expiresAt, 'signup');

      return res.render('pages/shopkeeper-otp-verify', {
        email,
        purpose: 'signup',
        message: `Registration successful! OTP sent to ${email}. You will verify phone after email.`,
        step: 'email',
        emailVerified: false,
      });
    } catch (err) {
      return res.render('pages/shopkeepersignup', { registerFail: true });
    }
  },
  insertMediReqC: async (req, res) => {
    try {
      const {
        mediId, mediName, shopMail, quantity, ppic,
      } = req.body;
      const userMail = req.user.mail;
      const userRecord = await UserModels.getUser(userMail);
      const userId = userRecord && userRecord[0] ? userRecord[0].u_id : null;
      const images = req.files || {};
      const ppicFilename = images.ppic && images.ppic[0] ? images.ppic[0].filename : 'default-prescription.jpg';

      const registerData = await UserModels.insertMediReqM(
        userId, userMail, mediId, mediName, shopMail, quantity, ppicFilename,
      );
      res.redirect('/req')
    } catch (err) {
      return res.render('pages/request');
    }
  },

  /* ======Worker Register controller ====== */

  getMedicineData: async (req, res) => {
    const { mid } = req.query
    const allRawMedicine = await UserModels.getRawMedicine(mid)
    res.send(allRawMedicine)
  },
  getSearchMediData: async (req, res) => {
    const { mname } = req.query
    const allSearchMedicine = await UserModels.getSearchMedicine(mname)

    res.send(allSearchMedicine)
  },
  getMedicineSuggestions: async (req, res) => {
    const { q } = req.query
    const suggestions = await UserModels.getMedicineSuggestions(q)
    res.json(suggestions)
  },

  bookData: async (req, res) => {
    try {
      const {
        service_id,
      } = req.body;
      res.redirect(`/request/${service_id}`)
    } catch (e) {
      res.send('Somthing Wrong')
    }
  },

  /* ====== user update controller ====== */
  insertUserUpadateC: async (req, res) => {
    try {
      const {
        firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass,
      } = req.body;
      if (email !== req.user.mail) {
        return res.redirect('/profile');
      }
      const userRecord = await UserModels.getUser(email);
      const userId = userRecord && userRecord[0] ? userRecord[0].u_id : null;
      if (!userId) {
        return res.redirect('/profile');
      }
      const errors = validationResult(req).formatWith((error) => error.msg);
      const images = req.files || {};
      const propicFilename = images.propic && images.propic[0] ? images.propic[0].filename : 'default-user.png';

      if (!errors.isEmpty()) {
        return res.render('pages/userupdate', {
          error: errors.mapped(),
          value: {
            userId, firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, pass,
          },
        });
      }
      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.UserUpdateM(
        firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, hashPassword, userId,
      );

      const subject = 'EMF Service active account';
      const textMessage = 'EMF Service account verify'
      const activeBtn = `
        <div style="padding: 0px 20px;margin-left: 8px;text-align: center;">
        <h4>Wellcome  ${firstName} ${lastName}.<h4>
        <p>If you are update your profile for EMF Service.<p> <br>
        <p>Please EMF Service account verify. Othewise ignore the mail. <p>
        </div>
        <div>
        <a style="cursor: pointer;" href="${process.env.BASE_URL}/verify-account/${userId}">
        <button style="padding: 0px 20px;
        border-radius: 8px;
        background-color: #188bde;
        border : none;
        font-size: 15px;
        font-weight: 700;
        line-height: 36px;
        color: #FFFFFF;
        margin-left: 8px;
        text-align: center;
        cursor: pointer;">
        Active account</button></a>
        </div>
        `
      sendMail(email, subject, textMessage, activeBtn)
      res.redirect('/profile')
    } catch (err) {
      console.log('doom err', err)
      return res.render('pages/userupdate');
    }
  },

  /* ====== Logout Controller  ====== */
  logout: async (req, res) => {
    if (req.user) {
      await UserModels.deleteSession(req.user.mail, 'user');
    }
    res.clearCookie(process.env.COOKIE_NAME);
    res.redirect('/');
  },

  shopkeeperLogout: async (req, res) => {
    if (req.user) {
      await UserModels.deleteSession(req.user.mail, 'shopkeeper');
    }
    res.clearCookie(process.env.COOKIE_NAME);
    res.redirect('/shopkeeperlogin');
  },

  adminLogout: async (req, res) => {
    if (req.user) {
      await UserModels.deleteSession(req.user.mail, 'admin');
    }
    res.clearCookie(process.env.COOKIE_NAME);
    res.redirect('/admin');
  },

  accountVerify: async (req, res) => {
    const userId = req.params.id

    const isUpdate = await UserModels.updateStatus(userId)
    if (isUpdate.affectedRows) {
      res.redirect('/login')
    } else {
      res.redirect('/login')
    }
  },

  shopkeeperAccountVerify: async (req, res) => {
    const userId = req.params.id
    const isUpdate = await UserModels.workeracUpdateStatus(userId)
    if (isUpdate.affectedRows) {
      const subject = 'EMF account Activation';
      const textMessage = 'EMF Service account verify'
      const activeMassage = `
      <div style="padding: 0px 20px;margin-left: 8px;text-align: center;">
      <h4>Wellcom to our service.<h4>
      <p>We have activated your account.</p>
      <p>Thank you very much for staying with our service. </p>
      </div>`
      sendMail(userId, subject, textMessage, activeMassage)
    }
    res.redirect('/shopkeeper')
  },

  shopkeeperAccountHold: async (req, res) => {
    const userId = req.params.id

    const isUpdate = await UserModels.workerHoldUpdateStatus(userId)
    if (isUpdate.affectedRows) {
      const subject = 'EMF account block';
      const textMessage = 'EMF Service account verify'
      const activeMassage = `
      <div style="padding: 0px 20px;margin-left: 8px;text-align: center;">
      <h4>Wellcom to our service.<h4>
      <p>We are hold your account.</p>
      <p>Contrac with us for your acctivation. </p>
      </div>`
      sendMail(userId, subject, textMessage, activeMassage)
    }
    res.redirect('/shopkeeper')
  },
  medicineReqVerify: async (req, res) => {
    try {
      const reqId = req.params.id
      console.log('Accept request - reqId:', reqId, 'shopkeeper:', req.user.mail)
      const isUpdate = await UserModels.requestUpdateStatus(reqId)
      console.log('Update result:', isUpdate)
      if (isUpdate.affectedRows) {
        res.redirect('/servicereq')
      } else {
        res.redirect('/servicereq')
      }
    } catch (err) {
      console.error('Error in medicineReqVerify:', err)
      res.redirect('/servicereq')
    }
  },

  medicineReqHold: async (req, res) => {
    try {
      const reqId = req.params.id
      console.log('Hold request - reqId:', reqId, 'shopkeeper:', req.user.mail)
      const isUpdate = await UserModels.requestHoldUpdateStatus(reqId)
      console.log('Hold result:', isUpdate)
      if (isUpdate.affectedRows) {
        res.redirect('/servicereq')
      } else {
        res.redirect('/servicereq')
      }
    } catch (err) {
      console.error('Error in medicineReqHold:', err)
      res.redirect('/servicereq')
    }
  },

  medicineReqDelete: async (req, res) => {
    try {
      const pId = req.params.id
      const request = await UserModels.getMedicineRequestById(pId)
      if (!request || request.length === 0 || request[0].user_email !== req.user.mail) {
        res.redirect('/req')
        return
      }
      const isDelete = await UserModels.requestDeleteStatus(pId)
      res.redirect('/req')
    } catch (err) {
      res.redirect('/req')
    }
  },

  /* ====== Contact form submission ====== */
  submitContact: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      await UserModels.insertContactMessage(name, email, subject, message);
      res.redirect('/contact?success=true');
    } catch (e) {
      res.redirect('/contact?error=true');
    }
  },

  /* ====== Admin: View all shop inventories ====== */
  getAdminInventory: async (req, res) => {
    try {
      const inventories = await UserModels.getAllShopInventories();
      const shops = await UserModels.getAllWorkers();
      res.render('pages/admin-inventory', { inventories, shops, adminData: req.user ? req.user.mail : null });
    } catch (e) {
      res.send('Something went wrong');
    }
  },

  /* ====== Admin: View shop inventory by shop ====== */
  getAdminShopInventory: async (req, res) => {
    try {
      const { email } = req.query;
      const inventories = email ? await UserModels.getShopInventoryByEmail(email) : await UserModels.getAllShopInventories();
      const shops = await UserModels.getAllWorkers();
      res.render('pages/admin-inventory', { inventories, shops, adminData: req.user ? req.user.mail : null });
    } catch (e) {
      res.send('Something went wrong');
    }
  },

  /* ====== Admin: Stock transfer management ====== */
  getAdminTransfers: async (req, res) => {
    try {
      const transfers = await UserModels.getStockTransfers();
      const shops = await UserModels.getAllWorkers();
      const inventories = await UserModels.getAllShopInventories();
      res.render('pages/admin-transfers', { transfers, shops, inventories, adminData: req.user ? req.user.mail : null });
    } catch (e) {
      res.send('Something went wrong');
    }
  },

  createStockTransfer: async (req, res) => {
    try {
      const { from_shop, to_shop, medicine_name, quantity } = req.body;
      const adminEmail = req.user ? req.user.mail : null;
      if (!adminEmail) {
        return res.redirect('/admin');
      }
      await UserModels.createStockTransfer(from_shop, to_shop, medicine_name, parseInt(quantity), adminEmail);
      res.redirect('/admin/transfers');
    } catch (e) {
      res.send('Something went wrong');
    }
  },

  approveStockTransfer: async (req, res) => {
    try {
      const { id } = req.params;
      const transfer = await UserModels.getStockTransfers();
      const t = transfer.find(t => t.transfer_id == id);
      if (!t) return res.redirect('/admin/transfers');
      await UserModels.updateShopMedicineStock(t.from_shop_email, t.medicine_name, t.quantity);
      await UserModels.addShopMedicineStock(t.to_shop_email, t.medicine_name, t.quantity);
      await UserModels.updateStockTransferStatus(id, 'approved');
      res.redirect('/admin/transfers');
    } catch (e) {
      res.send('Something went wrong');
    }
  },

  rejectStockTransfer: async (req, res) => {
    try {
      const { id } = req.params;
      await UserModels.updateStockTransferStatus(id, 'rejected');
      res.redirect('/admin/transfers');
    } catch (e) {
      res.send('Something went wrong');
    }
  },

  /* ====== Shopkeeper: Get inventory as JSON for admin transfer form ====== */
  getShopInventoryJson: async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) return res.json([]);
      const items = await UserModels.getShopInventoryByEmail(email);
      res.json(items);
    } catch (e) {
      res.json([]);
    }
  },
};

module.exports = UserController;
