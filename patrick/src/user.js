const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  // ### `src/user.js`
  // First, write the schema for the user model in `src/user.js`. Each user has two
  // properties: `username`, a String, and `passwordHash`, also a String. Both
  // properties are required, and the username should be unique (use the option
  // `unique: true`).  This prevents two users from having the same username.
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('User', UserSchema);
