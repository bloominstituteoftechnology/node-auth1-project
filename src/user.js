const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.passwordHash, 12, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.passwordHash = hash;
    return next();
  });
});

UserSchema.methods.isPasswordValid = function (passwordGuess) {
  return bcrypt.compare(passwordGuess, this.passwordHash);
  // make into promise
};

module.exports = mongoose.model('User', UserSchema);
