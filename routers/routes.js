const router = require('express').Router();

const multer = require('multer');
const UserController = require('../controllers/UserController');
const PharmacyController = require('../controllers/PharmacyController');
const BackupController = require('../controllers/BackupController');

const upload = multer({ dest: 'public/uploads/' });

/* ======== import files ========= */
const {
  requireUser,
  requireShopkeeper,
  requireAdmin,
  checkCurrentLogin,
  redirectLoggedIn,
  redirectIfLoggedInAsRole,
} = require('../middleware/AuthMiddleware');
const { signupValidator, loginValidator } = require('../middleware/validator/userValidator');
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');

/* ======= Get Routes ======= */
router.get('/', UserController.getHome)
router.get('/home', UserController.getHome)
router.get('/about', UserController.getAbout)
router.get('/contact', UserController.getContact)
router.get('/offer', UserController.getOffer)
router.get('/admin', redirectIfLoggedInAsRole('admin'), UserController.getAdmin)
router.get('/booked', requireUser, UserController.getBooked)
router.get('/user', requireAdmin, UserController.getUser)
router.get('/shopkeeper', requireAdmin, UserController.getShopkeeper)
router.get('/servicereq', requireShopkeeper, UserController.getMediReqData)
router.get('/shopkeeperdesh', requireShopkeeper, UserController.getShopkeeperDesh)
router.get('/shopprofile', requireShopkeeper, UserController.getShopProfile)

router.post('/shopprofile', requireShopkeeper, upload.single('propic'), UserController.updateShopProfile)
router.get('/service', UserController.getServiceData)
router.get('/login', decorateHtmlResponse('Home'), redirectLoggedIn, UserController.newlogin);
router.get('/shopkeeperlogin', redirectIfLoggedInAsRole('shopkeeper'), UserController.shopkeeperlogin);
router.get('/profile', requireUser, UserController.profile);
router.get('/req', requireUser, UserController.userRequestData);
router.get('/signup', decorateHtmlResponse('SignUp'), checkCurrentLogin, UserController.registerC);
router.get('/userupdate', requireUser, UserController.userUpadateC);
router.get('/mediupdate', requireShopkeeper, UserController.mediUpadateC);
router.get('/request/:service_id', requireUser, UserController.mediReqC);
router.get('/shopkeepersignup', decorateHtmlResponse('SignUp'), redirectLoggedIn, UserController.shopkeeperRegisterC);

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
router.post('/alogin', redirectIfLoggedInAsRole('admin'), UserController.adminLoginData)
router.post('/add-medi', requireAdmin, UserController.mediData)
router.post('/add-medicine', requireShopkeeper, UserController.medicineData)
router.post('/update-stock', requireShopkeeper, UserController.updateStock)
router.post('/login', decorateHtmlResponse('Login'), redirectLoggedIn, UserController.loginC)
router.post('/shopkeeperlogin', redirectIfLoggedInAsRole('shopkeeper'), loginValidator, UserController.shopkeeperloginC)
router.post('/signup', redirectLoggedIn, upload.fields([{ name: 'propic' }]),
  decorateHtmlResponse('SignUp'),
  signupValidator,
  UserController.insertRegisterC,
);
router.post('/userupdate', requireUser, upload.fields([{ name: 'propic' }]), UserController.insertUserUpadateC);
router.post('/shopkeepersignup', redirectLoggedIn, upload.fields([{ name: 'propic' }, { name: 'nid1' }, { name: 'nid2' }]),
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

/* ======= Pharmacy Management (Shopkeeper) ======= */
router.get('/pharmacy/dashboard', requireShopkeeper, PharmacyController.getDashboard)

router.get('/pharmacy/suppliers', requireShopkeeper, PharmacyController.getSuppliers)
router.post('/pharmacy/suppliers/add', requireShopkeeper, PharmacyController.addSupplier)
router.post('/pharmacy/suppliers/update/:id', requireShopkeeper, PharmacyController.updateSupplier)
router.get('/pharmacy/suppliers/delete/:id', requireShopkeeper, PharmacyController.deleteSupplier)

router.get('/pharmacy/expenses', requireShopkeeper, PharmacyController.getExpenses)
router.post('/pharmacy/expenses/add', requireShopkeeper, PharmacyController.addExpense)
router.post('/pharmacy/expenses/update/:id', requireShopkeeper, PharmacyController.updateExpense)
router.get('/pharmacy/expenses/delete/:id', requireShopkeeper, PharmacyController.deleteExpense)
router.post('/pharmacy/expense-categories/add', requireShopkeeper, PharmacyController.addExpenseCategory)

router.get('/pharmacy/purchases', requireShopkeeper, PharmacyController.getPurchases)
router.get('/pharmacy/purchases/add', requireShopkeeper, PharmacyController.getPurchaseAdd)
router.post('/pharmacy/purchases/add', requireShopkeeper, PharmacyController.addPurchase)
router.get('/pharmacy/purchases/view/:id', requireShopkeeper, PharmacyController.viewPurchase)
router.get('/pharmacy/purchases/delete/:id', requireShopkeeper, PharmacyController.deletePurchase)

router.get('/pharmacy/sales', requireShopkeeper, PharmacyController.getSales)
router.get('/pharmacy/sales/add', requireShopkeeper, PharmacyController.getSaleAdd)
router.post('/pharmacy/sales/add', requireShopkeeper, PharmacyController.addSale)
router.get('/pharmacy/sales/view/:id', requireShopkeeper, PharmacyController.viewSale)
router.get('/pharmacy/sales/delete/:id', requireShopkeeper, PharmacyController.deleteSale)

router.get('/pharmacy/reports', requireShopkeeper, PharmacyController.getReports)

/* ======= Backup & Export ======= */
router.get('/admin/backups', requireAdmin, BackupController.getAdminBackups)
router.post('/admin/backups/trigger', requireAdmin, BackupController.triggerManualBackup)
router.get('/admin/backups/download/:file', requireAdmin, BackupController.downloadBackup)
router.get('/admin/backups/delete/:file', requireAdmin, BackupController.deleteBackup)

router.get('/pharmacy/export', requireShopkeeper, BackupController.getExportPage)
router.get('/pharmacy/export/download/json', requireShopkeeper, BackupController.exportJson)
router.get('/pharmacy/export/download/csv/:type', requireShopkeeper, BackupController.exportCsv)

module.exports = router;
