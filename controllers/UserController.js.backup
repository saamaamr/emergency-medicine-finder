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
   
   /* ====== New User register  Controller  ====== */
   registerC: async (req, res) => {
      const uId = null; // Removed localStorage usage
      const user = await UserModels.getUser(uId)
      res.render('pages/signup', { uId, user });
   },
  /* ====== User upadate  Controller  ====== */

  userUpadateC: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const user = await UserModels.getUser(uId)
    res.render('pages/edituser', { uId, user });
  },

  mediUpadateC: async (req, res) => {
     const wId = req.user ? req.user.mail : null;
    const shopkeeperData = wId ? await UserModels.workermailCatchM(wId) : null;
    const allMedicine = wId ? await UserModels.getMedicine(wId) : null;
    const allService = await UserModels.getaService()
    res.render('pages/mediupdate', { wId, shopkeeperData, allMedicine, allService });
  },
  mediReqC: async (req, res) => {
    const uId = req.user ? req.user.mail : null;
    const reqId = req.params.service_id;
    const user = uId ? await UserModels.getUser(uId) : null;
    const mediData = reqId ? await UserModels.getRequestMedicine(reqId) : null

    res.render('pages/request', { uId, user, reqId, mediData });
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
        userid, pass,
      } = req.body;

      if (userid && pass) {
        const alogin = await UserModels.getAdmin(userid);

        if (alogin.length > 0) {
          const validPass = await bcrypt.compare(pass, alogin[0].pass);
          if (validPass) {
            const token = jwt.sign(
              {
                name: 'Admin',
                mail: userid,
                role: 'admin'
              },
              process.env.JWT_SECRET,
              { expiresIn: maxAge },
            )

            res.clearCookie(process.env.COOKIE_NAME);
            res.cookie(process.env.COOKIE_NAME, token, { maxAge, httpOnly: true, signed: true });

            res.redirect('/admin');
          } else {
            res.send('Incorrect Password');
          }
        } else {
          res.send('Incorrect User ID');
        }
        res.end();
      } else {
        res.send('Please enter your Id, password.')
        res.end();
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
    res.render('pages/userreqest', { uId, userData,mediData });
  },

  /* ====== Register controller ====== */
  insertRegisterC: async (req, res) => {
    try {
      const { firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass } = req.body;
      const errors = validationResult(req).formatWith((error) => error.msg);
      const images = req.files || {};
      const propicFilename = images.propic && images.propic[0] ? images.propic[0].filename : 'default-user.png';

      if (!errors.isEmpty()) {
        return res.render('pages/signup', {
          error: errors.mapped(),
          value: { firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, pass },
        });
      }
      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.insertRegisterM(
        firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, hashPassword
      );


      const toMail = process.env.EMAIL_USER
      const subject = 'EMF Service active account';
      const textMessage = 'EMF Service account verify'
      const link = `${process.env.BASE_URL}`
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
      const { firstName, lastName, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass } = req.body;
      const images = req.files || {};
      const propicFilename = images.propic && images.propic[0] ? images.propic[0].filename : 'default-shop.png';
      const nid1Filename = images.nid1 && images.nid1[0] ? images.nid1[0].filename : 'default-nid.jpg';
      const nid2Filename = images.nid2 && images.nid2[0] ? images.nid2[0].filename : 'default-nid.jpg';

      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.insertWorkerRegisterM(
        firstName, lastName, gender, shopname, email, phone, propicFilename, nid1Filename, nid2Filename, house, road, division, zila, upazila, lat, lng, hashPassword
      );
      res.redirect('/shopkeeperlogin')
    } catch (err) {

      return res.render('pages/shopkeepersignup', { registerFail: true });
    }
  },
  insertMediReqC: async (req, res) => {
    try {
      const { userId, userMail, mediId, mediName, shopMail, quantity, ppic }
        = req.body;
      const images = req.files || {};
      const ppicFilename = images.ppic && images.ppic[0] ? images.ppic[0].filename : 'default-prescription.jpg';

      const registerData = await UserModels.insertMediReqM(
        userId, userMail, mediId, mediName, shopMail, quantity, ppicFilename
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




  bookData: async (req, res) => {
    try {
      const {
        service_id
      } = req.body;
      res.redirect('/request/' + service_id)
    } catch (e) {
      res.send('Somthing Wrong')
    }
  },

  /* ====== user update controller ====== */
  insertUserUpadateC: async (req, res) => {
    try {
      const { userId, firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass } = req.body;
      const errors = validationResult(req).formatWith((error) => error.msg);
      const images = req.files || {};
      const propicFilename = images.propic && images.propic[0] ? images.propic[0].filename : 'default-user.png';

      if (!errors.isEmpty()) {
        return res.render('pages/userupdate', {
          error: errors.mapped(),
          value: { userId, firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, pass },
        });
      }
      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.UserUpadateM(
        firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, hashPassword, userId
      );


       const toMail = process.env.EMAIL_USER
       const subject = 'EMF Service active account';
       const textMessage = 'EMF Service account verify'
       const link = `${process.env.BASE_URL}`
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
      console.log("doom err", err)
      return res.render('pages/userupdate');
    }
  },


  /* ====== Logout Controller  ====== */
  logout: async (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.redirect('/');
  },

  shopkeeperLogout: async (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.redirect('/shopkeeperlogin');
  },

  adminLogout: async (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.redirect('/admin');
  },

  accountVerify: async (req, res) => {
    const userId = req.params.id

    const isUpdate = await UserModels.updateStatus(userId)
    if (isUpdate.affectedRows) {
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
      res.redirect('/shopkeeper')
    }
  },

  shopkeeperAccountHold: async (req, res) => {
    const userId = req.params.id

    const isUpdate = await UserModels.workerHoaldUpdateStatus(userId)
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

      res.redirect('/shopkeeper')
    }
  },
  medicineReqVerify: async (req, res) => {
    const reqId = req.params.id
    const isUpdate = await UserModels.requestUpdateStatus(reqId)
    if (isUpdate.affectedRows) {
      res.redirect('/servicereq')
    }
  },

  medicineReqHold: async (req, res) => {
    const reqId = req.params.id

    const isUpdate = await UserModels.requestHoaldUpdateStatus(reqId)
    if (isUpdate.affectedRows) {
      res.redirect('/servicereq')
    }
  },
  medicineReqDelete: async (req, res) => {
    const reqId = req.params.id

    const isUpdate = await UserModels.requestDeleteStatus(reqId)
    if (isUpdate.affectedRows) {
      res.redirect('/req')
    }
  },

};

module.exports = UserController;
