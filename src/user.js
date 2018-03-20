const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true })
  .then(res => {
    console.log('connected to mongo')
  })
  .catch(err => console.log('Connection z failed', err));


const BCRYPT_COST = 11;

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true,
  },
});
UserSchema.methods.checkPassword = function (potentialPassword, cb) {
  bcrypt.compare(potentialPassword, this.passwordHash, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/* UserSchema.pre('save', function (next) {
  console.log("presave hook")
  bcrypt.hash(this.passwordHash, BCRYPT_COST, function (error, hash) {
    if (error) return next(error);
    this.passwordHash = hash;
    next();
  });
});
 */
module.exports = mongoose.model('User', UserSchema);
