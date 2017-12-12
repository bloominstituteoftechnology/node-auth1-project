const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  userPermissions: {
    type: String,
    default: 'user',
    enum: ['mod', 'user', 'admin'],
  },
  passwordHash: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
