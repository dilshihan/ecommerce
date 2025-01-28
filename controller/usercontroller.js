const userschema = require('../model/usermodel')
const bcrypt = require('bcrypt')
const saltround = 10




const registerUser= async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const user =await userschema.findOne({email})
        if(user)return res.render('/user/register',{message:'user already exists'})
            const hashedpassword = await bcrypt.hash(password,saltround)
        const newuser = new userschema({email,password:hashedpassword})
        await newuser.save()
        res.render('/user/register',{message:'account created successfully'})
    }catch(error){
        res.render('/user/register',{message:'somthing is wrong'})
    }
}


const  loginUser = async(req,res)=>{
    try{
        const {name,email,password}=req.body
        const user  = await userschema.findOne({email})
        if(!user) return res.render('/user/register',{message:'user does not exist'})
            const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.render('/user/register',{message:'invalid password'})
            req.session.user=true;
        req.session.email=email
        res.redirect('/user/home')
    }catch(error){
       res.render('/user/register',{message:'somthing went wrong'})
    }
}


const loadregister = async (req,res)=>{
    res.render('user/register',{message:''})
}   

module.exports={registerUser,loadregister,loginUser}