/* eslint-disable */
const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    trim: true,
  }
});

module.exports = mongoose.model('User', UserSchema);
