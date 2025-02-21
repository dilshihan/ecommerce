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
router.get('/menu',userauth.checksession,userauth.checkBan,usercontroller.loadmenu)
router.get('/about',userauth.checksession,userauth.checkBan,usercontroller.loadabout)
router.get('/contactus',userauth.checksession,userauth.checkBan,usercontroller.loadcontactus)
router.get('/cart',userauth.checksession,userauth.checkBan,usercontroller.loadcart)
router.post('/add-to-cart',userauth.checksession,userauth.checkBan,usercontroller.addtocart)
router.post('/remove-from-cart',userauth.checksession,userauth.checkBan,usercontroller.removefromcart) 
router.get('/productdetails/:id',userauth.checksession,userauth.checkBan,usercontroller.Productdetails)
router.post('/logout',userauth.checksession,usercontroller.logout)
router.get('/auth/google/callback', usercontroller.handleGoogleCallback)
router.post('/auth/google/callback', usercontroller.handleGoogleLogin)






module.exports=router;