const router = require('express').Router();

const multer = require('multer');
const UserController = require('../controllers/UserController');

const upload = multer({ dest: 'public/uploads/' });

/* ======== import files ========= */
const {
  requireUser,
  requireShopkeeper,
  requireAdmin,
  checkCurrentLogin,
  redirectLoggedIn,
} = require('../middleware/AuthMiddleware');
const { signupValidator, loginValidator } = require('../middleware/validator/userValidator');
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');

/* ======= Get Routes ======= */
router.get('/', UserController.getHome)
router.get('/home', UserController.getHome)
router.get('/about', UserController.getAbout)
router.get('/contact', UserController.getContact)
router.get('/offer', UserController.getOffer)
router.get('/admin', UserController.getAdmin)
router.get('/booked', requireUser, UserController.getBooked)
router.get('/user', requireAdmin, UserController.getUser)
router.get('/shopkeeper', requireAdmin, UserController.getShopkeeper)
router.get('/servicereq', requireShopkeeper, UserController.getMediReqData)
router.get('/shopkeeperdesh', requireShopkeeper, UserController.getShopkeeperDesh)
router.get('/service', UserController.getServiceData)
router.get('/login', decorateHtmlResponse('Home'), redirectLoggedIn, UserController.newlogin);
router.get('/shopkeeperlogin', UserController.shopkeeperlogin);
router.get('/profile', requireUser, UserController.profile);
router.get('/req', requireUser, UserController.userRequestData);
router.get('/signup', decorateHtmlResponse('SignUp'), checkCurrentLogin, UserController.registerC);
router.get('/userupdate', requireUser, UserController.userUpadateC);
router.get('/mediupdate', requireShopkeeper, UserController.mediUpadateC);
router.get('/request/:service_id', requireUser, UserController.mediReqC);
router.get('/shopkeepersignup', decorateHtmlResponse('SignUp'), UserController.shopkeeperRegisterC);

router.get('/logout', UserController.logout);
router.get('/shopkeeperlogout', UserController.shopkeeperLogout);
router.get('/adminlogout', UserController.adminLogout);

router.get('/verify-account/:id', UserController.accountVerify)
router.get('/verify-shopkeeper-account/:id', requireAdmin, UserController.shopkeeperAccountVerify)
router.get('/hold-shopkeeper-account/:id', requireAdmin, UserController.shopkeeperAccountHold)

router.get('/verify-medicine-request/:id', requireShopkeeper, UserController.medicineReqVerify)
router.get('/hold-medicine-request/:id', requireShopkeeper, UserController.medicineReqHold)
router.get('/delete-medicine-request/:id', requireUser, UserController.medicineReqDelete)

/* ======= Admin: Inventory & Stock Transfer ======= */
router.get('/admin/inventory', requireAdmin, UserController.getAdminInventory)
router.get('/admin/shop-inventory', requireAdmin, UserController.getAdminShopInventory)
router.get('/admin/transfers', requireAdmin, UserController.getAdminTransfers)
router.get('/admin/shop-inventory-json', requireAdmin, UserController.getShopInventoryJson)

/* ======= Post routes ======== */
router.post('/alogin', UserController.adminLoginData)
router.post('/add-medi', requireAdmin, UserController.mediData)
router.post('/add-medicine', requireShopkeeper, UserController.medicineData)
router.post('/login', decorateHtmlResponse('Login'), UserController.loginC)
router.post('/shopkeeperlogin', loginValidator, UserController.shopkeeperloginC)
router.post('/signup', upload.fields([{ name: 'propic' }]),
  decorateHtmlResponse('SignUp'),
  signupValidator,
  UserController.insertRegisterC,
);
router.post('/userupdate', requireUser, upload.fields([{ name: 'propic' }]), UserController.insertUserUpadateC);
router.post('/shopkeepersignup', upload.fields([{ name: 'propic' }, { name: 'nid1' }, { name: 'nid2' }]),
  UserController.insertShopkeeperRegisterC,
);
router.post('/request', requireUser, upload.fields([{ name: 'ppic' }]), UserController.insertMediReqC);
router.get('/medicine', UserController.getMedicineData)
router.get('/searchmedicine', UserController.getSearchMediData)
router.get('/medicine-suggestions', UserController.getMedicineSuggestions)
router.post('/book-service', requireUser, UserController.bookData)

/* ======= Contact form ======= */
router.post('/contact', UserController.submitContact)

/* ======= Admin: Stock transfer actions ======= */
router.post('/admin/create-transfer', requireAdmin, UserController.createStockTransfer)
router.get('/admin/approve-transfer/:id', requireAdmin, UserController.approveStockTransfer)
router.get('/admin/reject-transfer/:id', requireAdmin, UserController.rejectStockTransfer)

module.exports = router;
