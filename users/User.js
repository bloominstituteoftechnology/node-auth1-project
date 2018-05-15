const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
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
  session: {
    type: Number,
  }
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

userSchema.methods.isPasswordValid = function(passwordGuess) {
  return bcrypt.compare(passwordGuess, this.password); 
}

module.exports = mongoose.model('User', userSchema);
