const express = require('express')
const router = express.Router()
const usercontroller = require('../controller/usercontroller')
const userauth = require('../middleware/userauth')


router.get('/register',userauth.isLogin,usercontroller.loadregister)
router.post('/register',usercontroller.registerUser)
router.post('/login',usercontroller.loginUser)
router.get('/home',userauth.checksession,(req,res)=>{
    res.render('user/home',{message:req.session.email})

})






module.exports=router;