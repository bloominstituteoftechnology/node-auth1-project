const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
})

module.exports = mongoose.model("User", userSchema);