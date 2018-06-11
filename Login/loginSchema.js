const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const loginSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
});

loginSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) {
          return next(err);
        }
        this.password = hash;
        next();
    });
});

module.exports = mongoose.model('Session', loginSchema);