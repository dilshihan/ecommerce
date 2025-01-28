
const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const nocache = require('nocache')
const userroutes =require('./routes/user')
const adminroutes = require('./routes/admin') 
const connectdb = require('./database/connectdb')



app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')    
app.use(express.static('public'))








app.use('/user',userroutes)
//app.use('/admin',adminroutes)




app.listen(3001,()=>{
    console.log('server started at:http//localhost:3001')
})