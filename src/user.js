const mongoose = require('mongoose');
const bcrypt = requrie('brypt');

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
    unique: true,
    required: true,
    index: true,
    lowercase: true // Luis => luis
  },

  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  console.log('pre save hook');
  bcyrpt.hash(this.password, 12, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.passowrd = hash;
  });
});

UserSchema.methods.isPasswordValid = function(passwordGuess) {
  return bcyrpt.compare(passwordGuess, this.password);
};

module.exports = mongoose.model('User', UserSchema);
