const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    }
})

