const express = require('express')
const router  = express.Router()
const admincontreller = require('../controller/admincontroller')
const adminauth =require('../middleware/adminauth')

router.get('/login',adminauth.islogin,admincontreller.loadlogin)
router.post('/login',admincontreller.login)
router.get('/dashboard',adminauth.checksession,admincontreller.loaddashboard)
router.get('/users',adminauth.checksession,admincontreller.loaduser)
router.post('/ban-user',admincontreller.banUser)
router.get('/products',admincontreller.loadProducts);
router.get('/addproduct',adminauth.checksession,admincontreller.loadaddproduct)
router.post('/addproduct',admincontreller.addProduct);
router.get('/category',admincontreller.loadcategory)
router.get('/addcategory',admincontreller.loadaddcategory)
router.post('/addcategory',admincontreller.addcategory)




module.exports = router