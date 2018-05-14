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

userSchema.pre("save", (next) => {
    bcrypt.hash(this.password, 11, (err, hash) => {
        if(err) return next(err);

        this.password = hash;

        return next();
    })
})

module.exports = mongoose('User', userSchema);