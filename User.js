const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = mongoose.Schema({
  username: { 
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  }
})

User.pre('save', function(next){
  bcrypt.hash(this.password, 11, (err, hash) => {
    if (err) {
      return next(err);
    }
    console.log(err, hash)
    this.password = hash;
    return next()
  })
})

User.methods.comparePasswords = function(plaintextPass, cb) {
  bcrypt.compare(plaintextPass, this.password) 
    .then( isMatch => {
      cb(isMatch)
  })
    .catch( err => {
      console.log(err)
    })
  };
  


module.exports = mongoose.model('User', User);
