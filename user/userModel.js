const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  }
});

UserSchema.methods.validatePassword = function(passwordInput) {
  return bcrypt.compare(passwordInput, this.password);
};

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 12, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    
    next();
  })
});

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;