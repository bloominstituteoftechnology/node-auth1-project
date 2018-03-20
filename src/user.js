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
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

// UserSchema.pre('save', function(next) {
//   console.log("In the prehook")
//   bcrypt.hash(this.passwordHash, BCRYPT_COST, function(error, hash) {
//     if (error) return next(error);
//     console.log(hash)
//     this.passwordHash = hash;
//     console.log(this.passwordHash)
//     next();
//   });
// });

// UserSchema.pre('save', function(next) {
//   bcrypt
//     .hash(passwordHash, BCRYPT_COST)
//     .then(res => {
//       console.log(res)
//       next();
//     })
// });

// UserSchema.methods.checkPassword = function(potentialPassword, cb) {
//   bcrypt.compare(potentialPassword, this.passwordHash, (err, isMatch) => {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

module.exports = mongoose.model('User', UserSchema);
