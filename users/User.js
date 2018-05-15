const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 14, (err, hash) => {
    if(err) {
      return next(err);
    }

    this.password = hash;

    return next(); //saves to the db
  });
});

userSchema.methods.isPasswordValid = function(passwordGuess) {
  return bcrypt.compare(passwordGuess, this.password);
};

// userSchema.post('save', function(next) {
//   console.log('post save hook')

//   next();
// });

module.exports = mongoose.model('User', userSchema);