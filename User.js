const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

User.pre('save', function(next) {
  bcrypt.hash(this.password, 12, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', User);