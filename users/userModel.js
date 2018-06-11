const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
})

User.pre('save', function(next) {
    console.log('pre save hook');

    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) return next(err);
        
        this.password = hash;
        return next();
    })
})

module.exports = mongoose.model('User', User);