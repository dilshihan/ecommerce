const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, 
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    updateAt: {
        type: Date,
        default: Date.now, 
    }
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
