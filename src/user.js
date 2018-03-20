const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_COST = 11;

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;

mongoose
  .connect('mongodb://localhost/users', { useMongoClient: true })
  // eslint-disable-next-line no-console
  .then(() => console.log('API connected...MongoDB connected...'))
  // eslint-disable-next-line no-console
  .catch(() => console.log('Connection to API failed'));

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  }
});
// eslint-disable-next-line prefer-arrow-callback
// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  bcrypt.hash(this.passwordHash, BCRYPT_COST, (err, hash) => {
    if (err) return next(err);
    this.passwordHash = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);
