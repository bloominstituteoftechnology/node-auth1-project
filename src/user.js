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
    min: [1, 'Password Length not Acceptable'],
    unique: true,
    required: true
  },
  passHash: { type: String, required: true }
});

UserSchema.methods.checkPassword = function (passGuess) {
  return bcrypt.compare(passGuess, this.passHash);
};

module.exports = mongoose.model('User', UserSchema);