const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowecase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  }
});

module.exports = mongoose.model('User, userModel');
