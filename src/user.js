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

UserSchema.pre('save', function(next) {
  let user = this;
  bcrypt.hash(user.passwordHash, BCRYPT_COST, function(error, hash) {
    if (error) return next(error);
    // console.log(hash)
    user.passwordHash = hash;
    // console.log(this.passwordHash)
    next();
  });
});

// UserSchema.pre('save', function(next) {
//   bcrypt
//     .hash(passwordHash, BCRYPT_COST)
//     .then(res => {
//       res.json(res);
//       next();
//     })
// });

// UserSchema.methods.checkPassword = function(potentialPassword, cb) {
//   let user = this;
//   bcrypt.compareSync("potentialPassword", user.passwordHash)
//   .then( matched => {
//     res.json({ success: true })
//   })
//   .catch( matched => res.send({ failure: "pwds_dont_match" }))
// };

module.exports = mongoose.model('User', UserSchema);
