const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  }
});

// UserSchema.pre("save", function(next) {
//   //console.log("pre save hook");
//   bcrypt.hash(this.password, 12, (err, hash) => {
//       //12 is 2^12
//     //console.log(this.password);
//     if (err) {
//       return next(err);
//     }
//     this.password = hash;
//     //password is now hashed before it's passed to API
//     next();
//   });
// });

UserSchema.pre("save", function(next) {
  bcrypt.hash(this.password, 12, (err, hash) => {
    if (err) next(err);
    this.password = hash;
    next();
  });
});

UserSchema.methods.validatePassword = function(inputedPassword) {
  return bcrypt.compare(inputedPassword, this.password);
};

//User turns into the users collection name
const UserModel = mongoose.model("User", UserSchema);
//optional 3rd argument that would specify the name of the database collection

module.exports = UserModel;
