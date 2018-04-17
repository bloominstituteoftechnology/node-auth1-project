const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users').then(() => {
  console.log('==== connected to users ====');
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.passwordHash, 12, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.passwordHash = hash;
    return next();
  });
});

UserSchema.methods.isPasswordValid = function(passwordGuess) {
  return bcrypt.compare(passwordGuess, this.passwordHash);
};
// UserSchema.statics.middleware = function(id, passwordGuess) {
// find document
// return.bcrypt.compare(passwordGuess, user.password);
// }
module.exports = mongoose.model('User', UserSchema);
