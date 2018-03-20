/* eslint-disable func-names, prefer-arrow-callback */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_COST = 11;
// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.passwordHash, BCRYPT_COST, (error, hash) => {
    if (error) return next(error);
    this.passwordHash = hash;
    next();
  });
});

UserSchema.methods.checkPassword = function (potentialPassword, cb) {
  bcrypt.compare(potentialPassword, this.passwordHash, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
