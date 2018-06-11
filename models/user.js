const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Passwords must be at least 8 charaacters long']
  }
});

userSchema.pre('save', function(next){
  bcrypt.hash(this.password, 12, (error, hash) => {
    if(error) return next(error);
    this.password = hash;
    next();
  });
});

userSchema.methods.isPasswordValid = function(input){
  return bcrypt.compare(input, this.password);
};

module.exports = mongoose.model('User', userSchema);