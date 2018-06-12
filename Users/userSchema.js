const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
});

userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) {
          return next(err);
        }
        this.password = hash;
        next();
    });
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema);