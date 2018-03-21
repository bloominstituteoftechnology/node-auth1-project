/* eslint-disable */
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const BCRYPT_COST = 11;

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
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
    trim: true,
  }
});

UserSchema.pre("save", function(next) {
  bcrypt.hash(this.passwordHash, BCRYPT_COST, (err, hash) => {
    if (err) return next(err);
    this.passwordHash = hash;
    next();
  })
})

module.exports = mongoose.model('User', UserSchema);
