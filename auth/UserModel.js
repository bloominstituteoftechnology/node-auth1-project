const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        uniqure: true,
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
    console.log('pre save hook')
    next();
});

const userModel = mongoose.model('Person', userSchema);