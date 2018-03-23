/* eslint no-console: 0 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;

const BCRYPT_COST = 11;

mongoose
  .connect('mongodb://localhost/users', { useMongoClient: true })
  .then(res => {
    console.log('Successfully connected to MongoDB');
  })
  .catch(err => {
    console.log('Database connection failed. Error: ', err);
  });

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

UserSchema.methods.checkPassword = function(potentialPass) {
  return bcrypt.compare(potentialPass, this.passwordHash);
};

// UserSchema.methods.checkPassword = function(potentialPass, cb) {
//   bcrypt.compare(potentialPass, this.passwordHash, (err, passwordsMatch) => {
//     if (err) return cb(err);
//     cb(null, passwordsMatch);
//   });
// };

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.passwordHash, BCRYPT_COST, (err, hashed) => {
    if (err) return next(err);
    this.passwordHash = hashed;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);