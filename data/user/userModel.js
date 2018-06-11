const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
    //defs
});

const usersModel = mongoose.model('User', UserModel);

module.exports = usersModel;