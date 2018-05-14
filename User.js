const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //< ===========

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Kyle => kyle
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 11, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;

    return next(); // goes on to save to the db
  });
});

// userSchema.post('save', function(next) {
//   console.log('post save hook');

//   next();
// });

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);