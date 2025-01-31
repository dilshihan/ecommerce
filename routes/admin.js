const express = require('express')
const router  = express.Router()
const admincontreller = require('../controller/admincontroller')
const adminauth =require('../middleware/adminauth')

router.get('/login',adminauth.islogin,admincontreller.loadlogin)
router.post('/login',admincontreller.login)






module.exports = router