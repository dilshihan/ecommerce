const userschema = require('../model/usermodel')
const Productmodel = require('../model/prodectmodel')
const bcrypt = require('bcrypt')
const saltround = 10
const nodemailer = require('nodemailer')





const OTPs = new Map(); // Temporary store for OTPs 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohddilshan1234321@gmail.com',
        pass: 'ykbc aoyd ilqv alka'
    }
});

// Function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const registerUser = async (req, res) => {
    try {
        const {email, password } = req.body;

        const user = await userschema.findOne({ email });
        if (user) return res.render('user/register', { message: 'User already exists' });

        const otp = generateOTP();
        req.session.otp=otp // Store OTP temporarily
        req.session.email=email
        req.session.password=password
        // Send OTP to email
        await transporter.sendMail({
            from: 'mohddilshan1234321@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        });
        res.render('user/verify', { email, message: 'OTP sent to your email' });

    } catch (error) {
        res.render('user/register', { message: 'Something went wrong' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const storedOTP = req.session.otp;

        if (!storedOTP || storedOTP !== parseInt(otp)) {
            return res.render('user/verify', { email, message: 'Invalid OTP' });
        } 

        const hashedPassword = await bcrypt.hash(req.session.password, saltround);
        const newUser = new userschema({ email: req.session.email, password: hashedPassword });
        await newUser.save();

        req.session.otp = null; // Remove OTP after verification

        
        const products = await Productmodel.find({});
        

        res.render('user/home', { products, message: 'Account created successfully' });

    } catch (error) {
        console.log(error);
        res.render('user/verify', { message: 'Something went wrong' });
    }
};

const resendOTP = async (req, res) => { 
    try { 
        const email = req.session.email; 
        if (!email) {
            return res.render('user/verify', { message: 'Please start the registration process first.' });
        }
        const newOTP = generateOTP();
        req.session.otp = newOTP;  

        await transporter.sendMail({
            from: 'mohddilshan1234321@gamil.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your ResendOTP code is ${newOTP}`
        });
        res.render('user/verify', { email, message: 'A new OTP has been sent to your email' });

    } catch (error) {
        console.log(error);
        res.render('user/verify', { message: 'Something went wrong.' });
    }
};

const  loginUser = async(req,res)=>{
    try{
        const {name,email,password}=req.body
        const user  = await userschema.findOne({email})
        if(!user) return res.render('user/register',{message:'user does not exist'})
            const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.render('user/register',{message:'invalid password'})
            req.session.user=true;
        req.session.email=email
        res.redirect('/user/home')
    }catch(error){
       res.render('user/register',{message:'somthing went wrong'})
    }
}

const loadregister = async (req,res)=>{
    res.render('user/register',{message:''})
}   

const Loadhome = async (req, res) => {
    try {
        const products = await Productmodel.find({}); // Fetch all products
        res.render("user/home", { products }); // Pass products to EJS
    } catch (error) {
        console.error(error);
    }
};

const logout = (req,res)=>{
    req.session.user=null;
    res.redirect('/user/register')
}

const loadmenu= async (req, res) => {
        try {
            const products = await Productmodel.find({});
            res.render("user/menu", { products });
        } catch (error) {
            console.error(error)
        }
    }
const Productdetails = async (req, res) => {
        try { 
            const products = await Productmodel.findById(req.params.id);
            if (!products) {
                return res.redirect('/user/menu');
            }
            
            res.render('user/productdetails', { products });
        } catch (error) {
            console.error(error);
        }
    }

module.exports={registerUser,loadregister,loginUser,
               verifyOTP,resendOTP,logout,Loadhome,
               loadmenu,Productdetails}