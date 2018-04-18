const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.passwordHash, 11, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.passwordHash = hash;
    return next();
  });
});

UserSchema.methods.isPasswordValid = function(passwordGuess, res) {
  return bcrypt
    .compare(passwordGuess, this.passwordHash)
    .then(response => {
      return response;
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

module.exports = mongoose.model('User', UserSchema);
