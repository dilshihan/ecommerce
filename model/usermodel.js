const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Banned'], default: 'Active' } 
});

module.exports = mongoose.model('user', userschema);
