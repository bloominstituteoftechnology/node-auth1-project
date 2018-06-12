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


const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel;