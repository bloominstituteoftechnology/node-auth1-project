const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
});

userSchema.pre('save', function(next) {
    // console.log('pre save hook');
    bcrypt.hash(this.password, 12, (err, hash) => {
        // it's actually 2^12 rounds
        if (err) {
        return next(err);
        }
        this.password = hash;
        return next(); // goes on to save to the db
    });
});

userSchema.methods.isPasswordValid = function(passwordGuess) {
    return bcrypt.compare(passwordGuess, this.password);
};



//const userModel
module.exports = mongoose.model('User', userSchema);