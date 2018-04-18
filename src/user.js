const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', (next) => {
  bcrypt.hash(this.passwordHash, 12, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.passwordHash = hash;

    return next();
  });
});

UserSchema.methods.isPasswordValid = (passwordGuess) => {
  return bcrypt.compare(passwordGuess, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
