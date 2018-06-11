const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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

userSchema.pre('save', function(next) {
  console.log('pre save hook');
  bcrypt.hash(this.password, 16, (err, hash) => {
    if (err) next(err);
    else {
      this.password = hash;
      next();
    };
  });
});

//from https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};




module.exports = mongoose.model('User', userSchema);
