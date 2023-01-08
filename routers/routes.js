const router = require('express').Router();
const axios = require('axios');
const HTMLParser = require('node-html-parser')
const UserController = require('../controllers/UserController');

router.post('/add-admin', UserController.asignupData)
router.post('/alogin', UserController.adminLoginData)
router.post('/login', UserController.loginData)
router.post('/add-user', UserController.signupData)
router.post('/add-amedicine', UserController.addMedicineData)

router.get('/addamedicine', UserController.amedicineData)

router.get('/signup', UserController.getSignupForm)
router.get('/asignup', UserController.getaSignupForm)

router.get('/login', UserController.getloginForm)

// router.get('/alogin', UserController.getAdminLoginForm)
router.get('/', UserController.getHome)


// for districts
router.get('/get-all-district-list', async (req, res, next) => {
  const url = 'https://raw.githubusercontent.com/fahimreza-dev/bangladesh-geojson/master/bd-districts.json'
  const response = await axios.get(url)
  const { data } = response
  const root = HTMLParser.parse(data)
  const districts = root.querySelectorAll('#dis option')
  const districtsList = []
  districts.forEach((district) => {
    const optValue = trimStr(district.rawAttrs.split('value=')[1].split('"')[1])
    if (!optValue) return
    districtsList.unshift(optValue)
    console.log(districtsList);
  })
  res.json(districtsList)
})


router.get('/logout', UserController.getlogout)
router.get('/alogout', UserController.getAdminlogout)


router.get('/admin', UserController.getAdmin)
router.get('/shopkeeper', UserController.getShopkeeper)
router.get('/addmedicine', UserController.getAddMedicine)
router.get('/updatemedicine', UserController.getUpdateMedicine)
router.get('/medicine', UserController.getMedicine)
router.get('/medicinedata', UserController.getMedicineData)

router.get('/updatemedicine', UserController.getUpdateMedicine)
router.get('/verify-account/:id', UserController.accountVerify)

//
module.exports = router;
