const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
})

UserSchema.pre('save', function(next) {
    console.log('Pre Save Hook');

    bcrypt.hash(this.password, 12, (error, hash) => {
        if (error) {
            return next(error);
        }
        this.password = hash
        return next();
    })
})

UserSchema.methods.validatePassword = function(passwordGuess) {
    return bcrypt.compare(passwordGuess, this.password);
};

module.exports = mongoose.model('User', UserSchema);