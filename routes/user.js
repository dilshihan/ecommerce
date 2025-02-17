const express = require('express')
const router = express.Router()
const usercontroller = require('../controller/usercontroller')
const userauth = require('../middleware/userauth')


router.get('/register',userauth.isLogin,usercontroller.loadregister)
router.post('/register',usercontroller.registerUser)
router.post('/verify',usercontroller.verifyOTP)
router.get('/resendotp',usercontroller.resendOTP)
router.post('/login',usercontroller.loginUser)
router.get('/home',userauth.checksession,usercontroller.Loadhome)
router.get('/menu',usercontroller.loadmenu) 
router.get('/productdetails/:id',usercontroller.Productdetails)
router.post('/logout',userauth.checksession,usercontroller.logout)






module.exports=router;