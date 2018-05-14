const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  }
});


userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 11, (err, hash) => {
    if (err) return next(err);

    this.password = hash;
    return next(); //go on to save to db
  })
});


userSchema.post('save', function(next) {
  console.log('post save hook');
  // next();
});

module.exports = mongoose.model('User', userSchema);

