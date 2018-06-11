const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
}); 

module.exports = mongoose.model('Login', LoginSchema, 'logins')