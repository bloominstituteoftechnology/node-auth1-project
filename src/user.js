const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    type: String,
    min: [1, 'Please type in a password.'],
    unique: true,
    required: true
  },
  passwordHash: { type: String, required: true }
});

UserSchema.methods.checkPassword = function (passwordGuess) {
  return bcrypt.compare(passwordGuess, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
