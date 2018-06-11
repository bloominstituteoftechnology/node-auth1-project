const mongoose = require('mongoose');

const LoginModel = new mongoose.Schema({
    //defs
});

const loginModel = mongoose.model('Login', LoginModel);

module.exports = loginModel;