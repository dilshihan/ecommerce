const userschema = require('../model/usermodel')
const Productmodel = require('../model/prodectmodel')
const bcrypt = require('bcrypt')
const saltround = 10
const nodemailer = require('nodemailer')
const Category = require('../model/categorymodel')





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
        const catogorys=await Category.find({})

        res.render('user/home', { products, message: 'Account created successfully' ,catogorys});

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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userschema.findOne({ email });

        if (!user) {
            return res.render("user/register", { message: "User does not exist" });
        }

        if (user.status === "Banned") { 
            return res.render("user/register", { message: "User email blocked, please try another email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("user/register", { message: "Invalid password" });
        }

        req.session.user = user._id; //Store ObjectId
        req.session.email = user.email;
        res.redirect("/user/home");
    } catch (error) {
        console.error(error);
    }
};

const loadregister = async (req,res)=>{
    res.render('user/register',{message:''})
}   

const Loadhome = async (req, res) => {
    try {
        const products = await Productmodel.find({}); // Fetch all products
        const catogorys = await Category.find({}); 
        res.render("user/home", { products ,catogorys}); // Pass products to EJS
    } catch (error) {
        console.error(error);
    }
};

const loadmenu = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 9; 
        const filter = { isListed: true };
        const totalProducts = await Productmodel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        
        const products = await Productmodel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

            if (req.xhr) { // If AJAX request
                return res.json({
                    success: true,
                    products,
                    currentPage: page,
                    totalPages
                });
            } else {
                return res.render("user/menu", { 
                    products,
                    currentPage: page,
                    totalPages
                });
            }
    } catch (error) {
        console.error(error);
    }
}  

const loadabout = async (req,res)=>{
    try{
        res.render('user/about')
    }catch(error){
        console.log(error)
    }
}

const loadcontactus = async(req,res)=>{
    try{
        res.render('user/contactus')
    }catch(error){
        console.log(error)
    }
}

const Productdetails = async (req, res) => {
        try { 
            const products = await Productmodel.findById(req.params.id);
            if (!products) {
                return res.redirect('/user/menu');
            }
            const relatedProducts = await Productmodel.find({
                category: products.category,
                _id: { $ne: req.params.id } // Exclude current product
            }).limit(4);
            
            res.render('user/productdetails', { products,relatedProducts});
        } catch (error) {
            console.error(error);
        }
 }

const handleGoogleLogin = async (req, res) => {
    try {
        const { token, userData } = req.body;
        
        // Check if user already exists
        let user = await userschema.findOne({ email: userData.email });
        
        if (!user) {
            // Create new user if doesn't exist
            user = new userschema({
                email: userData.email,
                // Store a random password since Google auth doesn't provide one
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), saltround),
                status: 'Active'
            });
            await user.save();
        } else if (user.status === "Banned") {
            return res.json({
                success: false,
                message: "This account has been banned"
            });
        }

        // Set session
        req.session.user = user._id;
        req.session.email = user.email;

        res.json({
            success: true,
            message: "Successfully authenticated with Google"
        });

    } catch (error) {
        console.error("Google authentication error:", error);
        res.json({
            success: false,
            message: "Authentication failed"
        });
    }
};

const handleGoogleCallback = async (req, res) => {
    try {
        // Send a script that posts the token back to the opener window
        res.send(`
            <script>
                if (window.opener) {
                    const params = new URLSearchParams(window.location.hash.substring(1));
                    const accessToken = params.get('access_token');
                    
                    // Get user info from Google
                    fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        window.opener.postMessage({
                            type: 'google-auth',
                            userData: {
                                email: data.email,
                                name: data.name,
                                picture: data.picture
                            }
                        }, window.location.origin);
                        window.close();
                    })
                    .catch(error => {
                        console.error('Error fetching user info:', error);
                        window.close();
                    });
                }
            </script>
        `);
    } catch (error) {
        console.error('Google callback error:', error);
        res.status(500).send('Authentication failed');
    }
};

const logout = (req,res)=>{
    req.session.user=null;
    res.redirect('/user/register')
}

module.exports={registerUser,loadregister,loginUser,
               verifyOTP,resendOTP,logout,Loadhome,
               loadmenu,loadabout,loadcontactus,
               Productdetails,handleGoogleLogin,
               handleGoogleCallback}