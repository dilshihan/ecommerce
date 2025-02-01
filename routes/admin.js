const express = require('express')
const router  = express.Router()
const admincontreller = require('../controller/admincontroller')
const adminauth =require('../middleware/adminauth')

router.get('/login',adminauth.islogin,admincontreller.loadlogin)
router.post('/login',admincontreller.login)
router.get('/dashboard',adminauth.checksession,admincontreller.loaddashboard)
router.get('/users',adminauth.checksession,admincontreller.loaduser)





module.exports = router