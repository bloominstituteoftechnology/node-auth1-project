/* eslint-disable */

const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

const bcrypt = require('bcrypt');
const BCRYPT_COST = 11;

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.passwordHash, BCRYPT_COST, (err, hash) => {
    if (err) {
      sendUserError(err, res);
      return;
    }

    this.passwordHash = hash;
    next();
  });
});

UserSchema.methods.checkPassword = function(password, cb) {
  bcrypt.compare(password, this.passwordHash, (isValid, err) => {
    err ? cb(err) : cb(isValid);
  });
};

module.exports = mongoose.model('User', UserSchema);
