const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ['Listed', 'Unlisted'], default: 'Listed' },
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
