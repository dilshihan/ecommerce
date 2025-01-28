const userschema = require('../model/usermodel')
const bcrypt = require('bcrypt')
const saltround = 10




const registerUser= async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const user =await userschema.findOne({email})
        if(user)return res.render('user/register',{message:'user already exists'})
            const hashedpassword = await bcrypt.hash(password,saltround)
        const newuser = new userschema({email,password:hashedpassword})
        await newuser.save()
        res.render('user/register',{message:'account created successfully'})
    }catch(error){
        res.render('user/register',{message:'somthing is wrong'})
    }
}


const loadregister = async (req,res)=>{
    res.render('user/register',{message:''})
}

module.exports={registerUser,loadregister}