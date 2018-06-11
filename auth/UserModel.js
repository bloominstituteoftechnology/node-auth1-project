const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const UserModel = new.mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required
    }
})