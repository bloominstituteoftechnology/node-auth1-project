const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
})

User.pre('save', function(next) {

    bcrypt.hash(this.password, 11, (err, hash) => {
        
        if(err) {
           return next(err); 
        }

        this.password = hash;
        return next();
    });
});

User.methods.passwordChecker = function(pass, cb) {
    // put bcrypt compare stuff in here
    
    bcrypt.compare(pass, this.password)
        .then(loggedIn => {
            cb(loggedIn)
        })
        .catch( err => {
            console.log(err)
        })
}

module.exports = mongoose.model('User', User);