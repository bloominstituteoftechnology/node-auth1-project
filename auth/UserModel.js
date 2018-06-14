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
        minlength: 4,
        // match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
        maxlength: 10
    }
});

userSchema.pre('save', function(next){
    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) {
            return next(err);
        }
        this.password = hash;
        next();
    });
});
userSchema.methods.isPasswordValid = function(passwordEntry){
    return bcrypt.compare(passwordEntry, this.password);
}
module.exports = mongoose.model('User', userSchema);