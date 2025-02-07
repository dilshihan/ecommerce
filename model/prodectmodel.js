const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }, 
    description: { type: String, trim: true },
    image: { type: [String], required: true }, 
    category: { type:String,  },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

