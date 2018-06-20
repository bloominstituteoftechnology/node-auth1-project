const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
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
    }
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 5, (err, hashed) => {
        if (err) next(err);
        this.password = hashed;
        next();
    })
})

userSchema.methods.validatePassword = function (passwordGuess) {
    
    return bcrypt.compare(passwordGuess, this.password)
}


module.exports = mongoose.model('Person', userSchema)