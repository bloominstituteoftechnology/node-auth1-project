const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //< =========== add bcrypt here

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
    //^^^ CANNOT BE ARROW FUNCTION because of bcrypt function
  bcrypt.hash(this.password, 11, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;

    return next(); // goes on to save to the db
  });
});

userSchema.methods.isPasswordValid = function(passwordGuess) {
    //^^^ CANNOT BE ARROW FUNCTION because of bcrypt function
  return bcrypt.compare(passwordGuess, this.password);
};


// userSchema.post('save', function(next) {
//   console.log('post save hook');
//   next();
// });

module.exports = mongoose.model('User', userSchema);