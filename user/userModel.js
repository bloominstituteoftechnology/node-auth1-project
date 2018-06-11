const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 5
    }
})
const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel;