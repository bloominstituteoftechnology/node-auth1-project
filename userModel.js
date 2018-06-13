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
        minlength: 4
    }
});

userSchema.pre('save', function(next) {
    console.log('pre save hook');
    
bcrypt.hash(this.password, 12, (err, hash) => {
    if(err) {
        return next(err);
    }
    else {
        this.password = hash;
        
        next();
    }
});
});

userSchema.methods.validatePassword = function(passwordGuess) {
    console.log(bcrypt.compare(passwordGuess, this.password));
    return bcrypt.compare(passwordGuess, this.password)
};


module.exports = mongoose.model('User', userSchema);