/* eslint-disable */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_COST = 11;

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
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.passwordHash, BCRYPT_COST, (error, hash) => {
    if (error) return next(error);
    this.passwordHash = hash;
    next();
  });
});

// UserSchema.methods.checkPassword = function(potentialPW) {
//   return new Promise((resolve, reject) => {
//     bcrypt.compare(potentialPW, this.passwordHash)
//     .then(isMatching => {
//       resolve(isMatching);
//     })
//     .catch(error => {
//       reject(error);
//     });
//   });
// };

UserSchema.methods.checkPassword = async function(potentialPW) {
  return await bcrypt.compare(potentialPW, this.passwordHash);
}

module.exports = mongoose.model('User', UserSchema);
