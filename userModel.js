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
    }
});

userSchema.pre('save', function (next) {
    return bcrypt
        .hash(this.passoword, 10)
        .then(hash => {
            this.password = hash;

            return next();
        })
        .catch(err => {
            return next(err);
        });
});

userSchema.methods.validatePassword = function (passwordGuess) {
    return bcrypt.compare(passwordGuess, this.password);
};

module.exports = mongoose.model('User', userSchema);