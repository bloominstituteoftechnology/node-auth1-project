const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema ({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
});


//this runs before (pre) save in server.post /api/register creating new user
userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 12, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

//mongoose instance method
userSchema.methods.isPasswordValid = function(passwordAttempt) {
  return bcrypt.compare(passwordAttempt, this.password);
}

module.exports = mongoose.model('User', userSchema);
