const express = require('express')
const router = express.Router()
const usercontroller = require('../controller/usercontroller')
const userauth = require('../middleware/userauth')


router.get('/register',usercontroller.loadregister)
router.post('/register',usercontroller.registerUser)






module.exports=router;