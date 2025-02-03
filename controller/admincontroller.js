const adminmodel = require('../model/adminmodel')
const bcrypt = require('bcrypt')
const usermodel = require('../model/usermodel')
const ProductModel = require('../model/prodectmodel')


const loadlogin  = async(req,res)=>{
    res.render('admin/login',{message:''})
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

const banUser = async (req, res) => {
    try {
        const { userId } = req.body; 
        const user = await usermodel.findById(userId);
        if (!user) {
            return res.send({ message: "User not found" });
        }
        user.status = user.status === "Active" ? "Banned" : "Active";
        await user.save();
        res.json({ success: true, status: user.status });
    } catch (error) {
        console.error(error);
    }   
};

const loadProducts = async (req, res) => {
        try {
            const admin = req.session.admin;
            if (!admin) {
                return res.redirect('/admin/login');
            }
            const products = await ProductModel.find({});
            res.render('admin/products', { products });
        } catch (error) {
            console.log(error);
            res.send('Something went wrong');
        }
    };
    





module.exports = {loadlogin,login,loaddashboard,loaduser,banUser,loadProducts}