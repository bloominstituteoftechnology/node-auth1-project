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

//my attempt at prototyping below
// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

userSchema.methods.isPasswordValid = function(passwordGuess) {
  //return a promise that comes out of bcrypt that compares
  return bcrypt.compare(passwordGuess, this.password);
}

//Luis had below in gist
// userSchema.post('save', function(next) {
//   console.log('post save hook');

//   next();
// });

module.exports = mongoose.model('User', userSchema);