const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

<<<<<<< HEAD
const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
=======
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
  },
>>>>>>> 137cebfe605ea4e2fd5bf3eeab5f863b4e182821
});

module.exports = mongoose.model('User', UserSchema);
