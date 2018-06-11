const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 12, (error, hash) => {
        if (error) {
            return next(error);
        }
        this.password = hash;

        next();
    });
});

module.exports = mongoose.model('User', userSchema); 