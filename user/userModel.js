const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 5
    }
})

UserSchema.pre('save', function(next) {   
      bcrypt.hash(this.password, 12, (err, hash) => {      
      if (err) {
        return next(err);
      }  
      this.password = hash;
        next();
    });

  });

  UserSchema.methods.validatePassword = function(passwordGuess) {
    return bcrypt.compare(passwordGuess, this.password);
  };  

const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel;