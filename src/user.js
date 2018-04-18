const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_COST = 12;

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/usersdb', { useMongoClient: true });

const UserSchema = new mongoose.Schema(
  {
    // TODO: fill in this schema
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.passwordHash, BCRYPT_COST, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.passwordHash = hash;
    return next();
  });
});

UserSchema.methods.isPasswordValid = function (passwordGuess) {
  return bcrypt.compare(passwordGuess, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
