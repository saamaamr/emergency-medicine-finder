const router = require('express').Router();

const UserController = require('../controllers/UserController');

const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });


/* ======== import files ========= */
const {
  requireAuth,
  requireUser,
  requireShopkeeper,
  requireAdmin,
  checkUser,
  checkCurrentLogin,
  redirectLoggedIn,
} = require('../middleware/AuthMiddleware');
const { singupValidator, loginValidator } = require('../middleware/validator/userValidator');
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');

/* ======= Get Routes ======= */
router.get('/', UserController.getHome)
router.get('/home', UserController.getHome)
router.get('/about', UserController.getAbout)
router.get('/contact', UserController.getContact)
router.get('/offer', UserController.getOffer)
router.get('/admin', requireAdmin, UserController.getAdmin)
router.get('/booked', requireUser, UserController.getBooked)
router.get('/user', requireAdmin, UserController.getUser)
router.get('/shopkeeper', requireAdmin, UserController.getShopkeeper)
router.get('/servicereq', requireShopkeeper, UserController.getMediReqData)
router.get('/shopkeeper', requireShopkeeper, UserController.getShopkeeperDesh)
router.get('/service', UserController.getServiceData)
router.get('/login', decorateHtmlResponse('Home'), redirectLoggedIn, UserController.newlogin,);

router.get(
  '/shopkeeperlogin', UserController.shopkeeperlogin,
);


router.get(
  '/profile', requireUser, UserController.profile,
);
router.get(
  '/req', requireUser, UserController.userRequestData,
);

router.get(
  '/signup',
  decorateHtmlResponse('SignUp'),
  checkCurrentLogin,
  UserController.registerC,
);

router.get(
  '/userupdate',
  requireUser,
  UserController.userUpadateC,
);

router.get(
  '/mediupdate',
  requireShopkeeper,
  UserController.mediUpadateC,
);

router.get(
  '/request/:service_id',
  requireUser,
  UserController.mediReqC,
);

router.get(
  '/shopkeepersignup',
  decorateHtmlResponse('SignUp'),
  UserController.shopkeeperRegisterC,
);

router.get('/logout', UserController.logout);
router.get('/shopkeeperlogout', UserController.shopkeeperLogout);
router.get('/adminlogout', UserController.adminLogout);

router.get('/verify-account/:id', UserController.accountVerify)
router.get('/verify-shopkeeper-account/:id', UserController.shopkeeperAccountVerify)
router.get('/hold-shopkeeper-account/:id', UserController.shopkeeperAccountHold)

router.get('/verify-medicine-request/:id', UserController.medicineReqVerify)
router.get('/hold-medicine-request/:id', UserController.medicineReqHold)
router.get('/delete-medicine-request/:id', UserController.medicineReqDelete)

/* ======= Post routes ======== */
router.post('/alogin', UserController.adminLoginData)
router.post('/add-medi', UserController.mediData)
router.post('/add-medicine', UserController.medicineData)
router.post('/login', decorateHtmlResponse('Login'), UserController.loginC)
router.post('/shopkeeperlogin', loginValidator, UserController.shopkeeperloginC)
router.post(
  '/signup', upload.fields([{ name: 'propic' }]),
  decorateHtmlResponse('SignUp'),
  singupValidator,
  UserController.insertRegisterC,
);

router.post(
  '/userupdate', upload.fields([{ name: 'propic' }]), UserController.insertUserUpadateC,
);

router.post(
  '/shopkeepersignup', upload.fields([{ name: 'propic' },
  { name: 'nid1' },
  { name: 'nid2' }]),
  UserController.insertShopkeeperRegisterC,
);
router.post(
  '/request', upload.fields([{ name: 'ppic' }]),  UserController.insertMediReqC,
);
router.get(
  '/medicine',
  UserController.getMedicineData
)

router.get(
  '/searchmedicine', UserController.getSearchMediData
)

router.post('/book-service', UserController.bookData)

module.exports = router;
