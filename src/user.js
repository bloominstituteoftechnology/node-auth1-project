const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const BCRYPT_COST = 11;

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, BCRYPT_COST, (error, hash) => {
    if (error) return next(error);
    this.password = hash;
    next();
  });
});

UserSchema.methods.checkPassword = function (potentialPassword) {
  return bcrypt.compare(potentialPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
