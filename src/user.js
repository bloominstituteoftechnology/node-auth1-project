// Code from Ryan's gist
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
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

// for some reason, needed to set the "user" to "this". this allows every password to be hashed within the schema before the .save() function in the server file
UserSchema.pre('save', function(next) {
  let user = this;
  bcrypt.hash(this.passwordHash, BCRYPT_COST, function(error, hash) {
    if (error) throw new Error(error);
    user.passwordHash = hash;
    next();
  });
});

UserSchema.methods.checkPassword = function(potentialPassword, cb) {
  bcrypt.compare(potentialPassword, this.passwordHash, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);

// Our original code
// const mongoose = require('mongoose');

// // Clear out mongoose's model cache to allow --watch to work for tests:
// // https://github.com/Automattic/mongoose/issues/1251
// mongoose.models = {};
// mongoose.modelSchemas = {};

// mongoose.Promise = Promise;
// mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

// const UserSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   passwordHash: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = mongoose.model('User', UserSchema);
