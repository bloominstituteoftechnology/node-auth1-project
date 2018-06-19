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
    },
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (error, hash) => {
        if (error) {
            return next(error);
        }

        this.password = hash;
        return next();
    });
});

userSchema.methods.validatePassword = function (passwordGuess) {
    return bcrypt.compare(passwordGuess, this.password);
};

module.exports = mongoose.model('User', userSchema);