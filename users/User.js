const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 11, (err, hash) => {
        if (err) {
            return next(err);
        } 
            this.password = hash;
            return next();
    });
});

userSchema.methods.isPasswordValid = function(passwordAttempt) {
    return bcrypt.compare(passwordAttempt, this.password);
}


module.exports = mongoose.model('User', userSchema, 'users')