const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
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

User.pre('save', function(next) {
    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    })
})

User.methods.validatePassword = function(passwordInput) {
    return bcrypt.compare(passwordInput, this.password);
}

const usersModel = mongoose.model('User', User);

module.exports = usersModel;