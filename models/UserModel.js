const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 4
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  }
});

userSchema.methods.compareHash = function(userPass, hash, cb) {
  bcrypt.compare(userPass, hash, function(err,isMatch) {
    if(err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
}

userSchema.pre("save", function(next) {
  bcrypt.hash(this.password, 12)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => {
      next(err);
    })
    
    
})

module.exports = mongoose.model("User", userSchema);