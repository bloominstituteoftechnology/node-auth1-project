const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
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

UserSchema.pre('save', function(next) {
    // console.log('pre save hook');
    bcrypt.hash(this.password, 12, (err, hash) => {
        if(err) {
            return next(err);
        }

        this.password = hash;
        next();
    })
});

UserSchema.methods.isPasswordValid = function(passwordGuess) {
    return bcrypt.compare(passwordGuess, this.password); // compare is a bcrypt method. // this line returns a promise which will be handled in the login route
}


module.exports = mongoose.model('User', UserSchema)