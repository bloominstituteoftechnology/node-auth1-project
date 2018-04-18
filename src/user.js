const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function(next) {
  console.log('save');
  bcrypt.hash(this.passwordHash, 11, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.passwordHash = hash;

    return next();
  });
});

UserSchema.methods.isPasswordValid = function(passwordGuess) {
  return bcrypt.compare(passwordGuess, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
