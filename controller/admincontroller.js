const adminmodel = require('../model/adminmodel')
const bcrypt = require('bcrypt')
const usermolde  = require('../model/usermodel')


const loadlogin  = async(req,res)=>{
    res.render('admin/login')
}

const login = async(req,res)=>{
     try{
        const {email,password}=req.body
        const admin = await adminmodel.findOne({email})
        if(!admin) return  res.render('admin/login',{Message:'invalid credentials'})
            const isMatch = await bcrypt.compare(password,admin.password)
        if(!isMatch) return res.render('admin/login',{Message:'invalid credentials'})
            req.session.admin = true
        res.redirect('/admin/dashboard')
     }catch(error){
        res.send(error)
     }
}


module.exports = {loadlogin,login}