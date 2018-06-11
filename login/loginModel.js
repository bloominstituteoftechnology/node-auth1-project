const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const loginModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

loginModel.pre("save", function(next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

module.exports = mongoose.model("Session", loginModel);
