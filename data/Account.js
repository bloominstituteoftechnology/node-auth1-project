const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcrypt');

let Account = new mongoose.Schema({
  username: { type: String, index: { unique: true }, required: true },
  password: { type: String, required: true }
});

Account.pre('save', function(next) {
  if (this.password) {
    let salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
  }
  next()
});

Account.methods.comparePassword = function(inputPassword, cb) {
  bcrypt.compare(inputPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(isMatch)
  })
};

module.exports = mongoose.model('Account', Account);
