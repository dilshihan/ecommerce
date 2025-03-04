const adminmodel = require('../model/adminmodel')
const bcrypt = require('bcrypt')
const usermodel = require('../model/usermodel')
const ProductModel = require('../model/prodectmodel')
const  Categorymodel = require('../model/categorymodel')



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

const loadaddproduct =async (req,res)=>{
    res.render('admin/addproduct',{title:'Add Product'})
}

const addProduct = async (req, res) => {
    try {
        
        const { name, price, stock, description, category } = req.body;
        
        // Extract filenames for multiple images
        const images = req.files ? req.files.map(file => file.filename) : [];

        if (!name || !price || !category || !description||!stock) {
            return res.status(400).send("all field are required");
        }
        const newProduct = new ProductModel({ 
            name, 
            price, 
            stock, 
            description, 
            image:images, 
            category 
        });

        await newProduct.save();
        res.redirect('/admin/products');

    } catch (error) {
        console.error(error);
        
    }
};

const loadupdateProduct = async (req, res) => {
  
    
    try {
        const productId = req.params.id;
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).send("Product not found");
        }
console.log(product);

        res.render("admin/updateproduct", { product });
    } catch (error) {
        console.error(error);
    }
};

const updateProduct = async (req, res) => {
console.log(req.body);

    
    try {
        const { name, price, description ,stock,category} = req.body;
        const productId = req.params.id;
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { name, price, description,stock,category},
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.redirect('/admin/products')
    } catch (error) {
        console.error(error);
    }
};

const Productlisting = async (req, res) => {
    try { 
        const { productId, isListed } = req.body;
        if (typeof isListed !== "boolean") {
            return res.status(400).json({ success: false, message: "Invalid isListed value" });
        }
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        product.isListed =isListed;
        await product.save();

        res.json({ success: true, isListed: product.isListed });
    } catch (error) {
        console.error(error);
    }
};

const loadcategory = async (req, res) => {
    try {
        const categories = await Categorymodel.find(); 
        res.render("admin/category",{categories});
    } catch (error) {
        console.log(error)
    }
};

const loadaddcategory = async(req,res)=>{
    res.render('admin/addcategory')
}

const addcategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const existingCategory = await Categorymodel.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists!" });
        }

        const newCategory = new Categorymodel({ name, description});
        await newCategory.save();

        res.json({ success: true, message: "Category added successfully!" });

    } catch (error) {
        console.error(error);
    }
};

const loadUpdateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Categorymodel.findById(categoryId);

        if (!category) {
            return res.status(404).send("Category not found");
        }

        res.render("admin/updatecategory", { category });
    } catch (error) {
        console.error( error);
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;

        const updatedCategory = await Categorymodel.findByIdAndUpdate(
            categoryId,
            { name, description},
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.json({ success: true, message: "Category updated successfully" });
    } catch (error) {
        console.error(error);
    }
};

const Categorylisting = async (req, res) => {
    try {
        const { categoryId, isListed } = req.body; 

        if (typeof isListed !== "boolean") {
            return res.status(400).json({ success: false, message: "Invalid isListed value" });
        }

        const category = await Categorymodel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        
        category.isListed = isListed;
        await category.save();

        res.json({ success: true, isListed: category.isListed });
    } catch (error) {
        console.error(error);
        
    }
};

const logout=async(req,res)=>{
    try {
        req.session.admin = null; 
        res.redirect('/admin/login');
    } catch (error) {
        console.error(error);
    }
}







module.exports = {loadlogin,login,loaddashboard,
loaduser,banUser,loadProducts,loadaddproduct,
addProduct,loadcategory,loadaddcategory,
addcategory,loadUpdateCategory,updateCategory,
Categorylisting,Productlisting,loadupdateProduct,
updateProduct,logout}