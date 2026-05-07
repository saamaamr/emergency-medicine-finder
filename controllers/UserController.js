const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const UserModels = require('../models/UserModels');
const { checkCurrentLogin } = require('../middleware/AuthMiddleware');

require('dotenv').config();

const maxAge = 3 * 24 * 60 * 60 * 1000;

/*===== Mail Confirmation =====*/
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: '', //user email athentication address@email.com
    pass: '', //user email athentication pass
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
/*==== Controlers ====*/
const UserController = {

  getHome: async (req, res) => {
    const allService = await UserModels.getaService()
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)
    res.render('pages/home', { uId, allService, userData })
  },
  getAbout: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/about', { uId, userData })
  },
  getContact: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/contact', { uId, userData })
  },
  getOffer: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/offer', { uId, userData })
  },
  // Admin Related
  getAdmin: async (req, res) => {
    const allUser = await UserModels.getallUser()
    const allService = await UserModels.getaService()
    const allWorker = await UserModels.getallWorker()
    const adminData = localStorage.getItem("adminData");

    res.render('pages/admin', { allUser, allService, allWorker, adminData })
  },
  getBooked: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId);
    const userBooking = await UserModels.getUserBooking(uId);

    res.render('pages/booked', { uId, userData, userBooking })
  },
  getUser: async (req, res) => {
    const allUser = await UserModels.getallUser()
    res.render('pages/user', { allUser })
  },

  getWorker: async (req, res) => {
    const allWorker = await UserModels.getallWorker()
    res.render('pages/worker', { allWorker })
  },

  getMediReqData: async (req, res) => {

    const uId = localStorage.getItem("workerData");
    const workerData = await UserModels.workermailCatchM(uId);
    const allMedicine = await UserModels.getMedicineReq(uId)

    res.render('pages/servicereq', { uId, workerData, allMedicine })

  },

  getWorkerDesh: async (req, res) => {
    const uId = localStorage.getItem("workerData");
    const workerData = await UserModels.workermailCatchM(uId);
    const allService = await UserModels.getaService()
    const allMedicine = await UserModels.getMedicine(uId)
    res.render('pages/workerdesh', { uId, allService, workerData, allMedicine })
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
      const userName = user[0].first_name;
      const userMail = user[0].email;
      const password = user[0].pass;



      if (user[0].u_id !== '') {

        const isValidPassword = await bcrypt.compare(pass, password);
        if (isValidPassword) {
          if (user[0].status == 1) {





            localStorage.setItem('userMail', `${userMail}`)

            const token = jwt.sign(
              {
                name: userName,
                mail: userMail,
              },
              process.env.JWT_SECRET,
              { expiresIn: maxAge },
            )

            if (token !== null) {
              res.cookie(process.env.COOKIE_NAME, token, { maxAge, httpOnly: true, signed: true });

              const allService = await UserModels.getaService()
              const uId = localStorage.getItem("userMail");
              const userData = await UserModels.getUser(uId)


              res.render('pages/home', { uId, allService, userData })

            }
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

  /* Worker login controller */
  workerloginC: async (req, res) => {
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
                const userMail = login[0].email;

                localStorage.setItem(`workerData`, `${userMail}`)

                res.redirect('/workers');
              } else {
                res.send('Your account not active.');
              }
            } else {
              res.send('Incorrect Password');
            }
          }
        } else {
          res.send('Incorrect Email Address');
        }
        res.end();
      } else {
        res.send('Please enter your email, password and role, If you have no account please sign up.')
        res.end();
      }
    } catch (e) {
      res.send('Wrong')
      // res.send(<script>alert("your alert message"); window.location.href = "/page_location"; </script>);
    }
  },

  /* ====== New User register  Controller  ====== */

  registerC: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)
    res.render('pages/signup', { uId, user });
  },
  /* ====== New Worker register  Controller  ====== */
  workerRegisterC: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)
    res.render('pages/workersignup', { uId, user });
  },

  /* ====== User upadate  Controller  ====== */

  userUpadateC: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)
    res.render('pages/edituser', { uId, user });
  },

  mediUpadateC: async (req, res) => {
     const wId = localStorage.getItem("workerData");
    const workerData = await UserModels.workermailCatchM(wId);  
    const allMedicine = await UserModels.getMedicine(wId)
    const allService = await UserModels.getaService() 
    res.render('pages/mediupdate', { wId, workerData,allMedicine, allService });
  },
  mediReqC: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const reqId = localStorage.getItem("requId");
    const user = await UserModels.getUser(uId)
    const mediData = await UserModels.getRequestMedicine(reqId)

    res.render('pages/request', { uId, user, reqId, mediData });
  },

  /* ====== New login Controller  ====== */

  newlogin: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)

    res.render('pages/login', { uId, user });
  },


  workerlogin: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)
    res.render('pages/workerlogin', { uId, user });
  },

  adminLoginData: async (req, res) => {
    try {
      const {
        userid, pass,
      } = req.body;

      if (userid && pass) {
        const alogin = await UserModels.getAdmin(userid);

        if (alogin.length > 0) {
          for (let i = 0; i < alogin.length; i++) {
            if (pass == alogin[0].pass) {
              localStorage.setItem(`adminData`, `${userid}`);
              res.redirect('/admin');
            } else {
              res.send('Incorrect Password');
            }
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
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/userprofile', { uId, userData });
  },

  userRequestData: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)
    const mediData = await UserModels.getMedicineUserReq(uId)
    res.render('pages/userreqest', { uId, userData,mediData });
  },

  /* ====== Register controller ====== */
  insertRegisterC: async (req, res) => {
    const { firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass } = req.body;
    const errors = validationResult(req).formatWith((error) => error.msg);
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)
    const images = req.files;
    propicFilename = images.propic[0].filename


    if (!errors.isEmpty()) {
      res.render('pages/signup', { uId, user });
      return res.render('pages/signup', {
        error: errors.mapped(),
        value: { firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, pass },
      });
    } try {
      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.insertRegisterM(
        firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, hashPassword
      );


      const toMail = "emflocal0@gmail.com"
      const subject = 'EMF Service active account';
      const textMessage = 'EMF Service account verify'
      const link = `${process.env.BASE_UR}`
      const activeBtn = `
      <div style="padding: 0px 20px;margin-left: 8px;text-align: center;">
      <h4>Wellcome  ${firstName} ${lastName}.<h4>
      <p>If you are sinup for EMF Service.<p> <br>
      <p>Please EMF Service account verify. Othewise ignore the mail. <p>
      </div>
      <div>
      <a style="cursor: pointer;" href="http://localhost:3802/verify-account/${registerData[0].insertId}">
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

  /* ======Worker Register controller ====== */
  insertWorkerRegisterC: async (req, res) => {
    try {
      const { firstName, lastName, gender, shopname, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, lat, lng, pass } = req.body;
      const images = req.files;
      propicFilename = images.propic[0].filename
      nid1Filename = images.nid1[0].filename
      nid2Filename = images.nid2[0].filename

      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.insertWorkerRegisterM(
        firstName, lastName, gender, shopname, email, phone, propicFilename, nid1Filename, nid2Filename, house, road, division, zila, upazila, lat, lng, hashPassword
      );
      res.redirect('/workerlogin')
    } catch (err) {

      return res.render('pages/workersignup', { registerFail: true });
    }
  },
  insertMediReqC: async (req, res) => {
    try {
      const { userId, userMail, mediId, mediName, shopMail, quantity, ppic }
        = req.body;
      const images = req.files;
      ppicFilename = images.ppic[0].filename

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
      localStorage.setItem(`requId`, `${service_id}`);
      res.redirect('/request')
    } catch (e) {
      res.send('Somthing Wrong')
    }
  },

  /* ====== user update controller ====== */
  insertUserUpadateC: async (req, res) => {
    const { userId, firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass } = req.body;
    const errors = validationResult(req).formatWith((error) => error.msg);
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)
    const images = req.files;
    propicFilename = images.propic[0].filename

    if (!errors.isEmpty()) {
      res.render('pages/userupdate', { uId, user });
      return res.render('pages/userupdate', {
        error: errors.mapped(),
        value: { userId, firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, pass },
      });
    }
    try {
      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.UserUpadateM(
        firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, hashPassword, userId
      );


      const toMail = "emflocal0@gmail.com"
      const subject = 'EMF Service active account';
      const textMessage = 'EMF Service account verify'
      const link = `${process.env.BASE_UR}`
      const activeBtn = `
        <div style="padding: 0px 20px;margin-left: 8px;text-align: center;">
        <h4>Wellcome  ${firstName} ${lastName}.<h4>
        <p>If you are update your profile for EMF Service.<p> <br>
        <p>Please EMF Service account verify. Othewise ignore the mail. <p>
        </div>
        <div>
        <a style="cursor: pointer;" href="http://localhost:3802/verify-account/${userId}">
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
    res.cookie(process.env.COOKIE_NAME, '', { maxAge, httpOnly: true, signed: true });
    localStorage.removeItem('userMail');
    res.redirect('/');
  },

  WorkerLogout: async (req, res) => {
    localStorage.removeItem('workerData');
    res.redirect('/workerlogin');
  },

  adminLogout: async (req, res) => {
    localStorage.removeItem('adminData');
    res.redirect('/admin');
  },

  accountVerify: async (req, res) => {
    const userId = req.params.id

    const isUpdate = await UserModels.updateStatus(userId)
    if (isUpdate.affectedRows) {
      res.redirect('/login')
    }
  },

  workerAccountVerify: async (req, res) => {
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
      res.redirect('/worker')
    }
  },

  workerAccountHold: async (req, res) => {
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

      res.redirect('/worker')
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

}
module.exports = UserController
