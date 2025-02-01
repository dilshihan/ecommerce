const adminmodel = require('../model/adminmodel')
const bcrypt = require('bcrypt')
const usermodel = require('../model/usermodel')


const loadlogin  = async(req,res)=>{
    res.render('admin/login')
}

const login = async(req,res)=>{
     try{
        const {email,password}=req.body
        const admin = await adminmodel.findOne({email})
        if(!admin) return  res.render('admin/login',{message:'invalid credentials'})
            const isMatch = await bcrypt.compare(password,admin.password)
        if(!isMatch) return res.render('admin/login',{message:'invalid credentials'})
            req.session.admin = true
        res.redirect('/admin/dashboard')
     }catch(error){
        res.send(error)
     }
}

const loaddashboard= async(req,res)=>{
    try{
        const admin = req.session.admin
        if(!admin){return res.redirect('/admin/login')} 
        res.render('admin/dashboard')
    }catch(error){
        console.log(error)
    }
   
}

const loaduser= async(req,res)=>{
    try{
        const admin = req.session.admin
        if(!admin){return res.redirect('/admin/login')}
        const user = await usermodel.find({})
        res.render('admin/users',{user})
    }catch(error){
        console.log(error)
    }   
}



module.exports = {loadlogin,login,loaddashboard,loaduser}