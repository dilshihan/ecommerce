const express = require('express')
const router  = express.Router()
const admincontreller = require('../controller/admincontroller')
const adminauth =require('../middleware/adminauth')
const upload = require("../utils/multer")

router.get('/login',adminauth.islogin,admincontreller.loadlogin)
router.post('/login',admincontreller.login)
router.get('/dashboard',adminauth.checksession,admincontreller.loaddashboard)
router.get('/users',adminauth.checksession,admincontreller.loaduser)
router.post('/ban-user',admincontreller.banUser)
router.get('/products',admincontreller.loadProducts);
router.get('/addproduct',adminauth.checksession,admincontreller.loadaddproduct)
router.post('/addproduct', upload, admincontreller.addProduct);
router.post('/products',admincontreller.Productlisting)
router.get("/updateproduct/:id", admincontreller.loadupdateProduct)
router.post('/updateproduct/:id',admincontreller.updateProduct)
router.get('/category',admincontreller.loadcategory)
router.get('/addcategory',admincontreller.loadaddcategory)
router.post('/addcategory',admincontreller.addcategory)
router.get('/categories/update/:id', admincontreller.loadUpdateCategory);
router.post('/categories/update/:id', admincontreller.updateCategory)
router.post('/categories/listing', admincontreller.Categorylisting);
router.get('/logout',adminauth.checksession,admincontreller.logout)




module.exports = router