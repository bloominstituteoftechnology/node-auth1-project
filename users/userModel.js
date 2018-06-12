const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
})

userSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 12, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  })
})

userSchema.methods.isPasswordValid = function (passwordGuess) {
  return bcrypt.compare(passwordGuess, this.password);
};

module.exports = mongoose.model('User', userSchema)