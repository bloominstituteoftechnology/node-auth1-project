const mongoose = require('mongoose');
const bcrypt = require('bcrypt-as-promised');

const BCRYPT_COST = 11;
const SALT_WORK_FACTOR = 10;

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
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

// eslint-disable-next-line func-names
UserSchema.methods.checkPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.passwordHash)
      .then(() => resolve(true))
      .catch(bcrypt.MISMATCH_ERROR, () => resolve(false))
      .catch(reject);
  });
};

// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('passwordHash')) {
    return next();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR)
    .then((salt) => {
      bcrypt.hash(user.passwordHash, salt)
        .then((hash) => {
          user.passwordHash = hash;
          next();
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = mongoose.model('User', UserSchema);
