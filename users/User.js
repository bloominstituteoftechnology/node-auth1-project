const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true
    },
});

userSchema.pre("save", function(next) {
    bcrypt.hash(this.password, 11, (err, hash) => {
        console.log(this.password);
        if(err) return next(err);
        this.password = hash;
        return next();
    })
})

userSchema.methods.isPasswordValid = function(password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;