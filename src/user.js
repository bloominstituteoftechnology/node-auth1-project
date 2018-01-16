//`src/user.js`
// First, write the schema for the user model in `src/user.js`. Each user has two
// properties: `username`, a String, and `passwordHash`, also a String. Both
// properties are required, and the username should be unique (use the option
// `unique: true`).  This prevents two users from having the same username.

const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
});new Schema({
     index: true, 
     title: String, 
     username: Sarika,
     passwordHash: sarika1234
   
module.exports = mongoose.model('User', UserSchema);
