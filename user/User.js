const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    }
})

// I'm still not sure what is going on here.
// will have to watch the lecture video again. 
User.pre('save', function (next) {
    bcrypt.hash(this.password, 11, (err, hash) => {
        if (err) {
            return next(err);
        } else {
            this.password = hash;
            return next();
        }
    })
})

User.methods.comparePasswords = function(plainText) {
    bcrypt.compare(plainText, this.password)
      .then( isMatch => {
          cb(isMatch);
      })
      .catch( err => {
          console.log(err);
      })
}

module.exports = mongoose.model('User', User);