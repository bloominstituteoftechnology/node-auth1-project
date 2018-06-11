const mongoose = require('mongoose');

const RegisterModel = new mongoose.Schema({
    //defs
});

const registerModel = mongoose.model('Register', RegisterModel);

module.exports = registerModel;