const mongoose = require('mongoose');
const bcrypt = ('bcrypt');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercsase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
});

module.exports = mongoose.model('Person', UserSchema);