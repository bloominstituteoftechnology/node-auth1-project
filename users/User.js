const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userModel = {
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
}

const options = {
    timestamps: true
}

const userSchema = new mongoose.Schema(userModel, options);

userSchema.pre('save', function(next) {
    if (err) {
        return next(err);
    }
    this.password = hash;
    return next();
})

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;