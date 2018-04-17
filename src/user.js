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
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  }
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.passwordHash, BCRYPT_COST, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.passwordHash = hash;

    next();
  });
});

UserSchema.methods.isValidLogin = function (checkPassword) {
  return bcrypt.compare(checkPassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
