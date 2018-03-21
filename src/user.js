const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251

const BCRYPT_COST = 11;

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
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  }
});

UserSchema.pre('save', function(next) {
  bcrypt.hash(password, BCRYPT_COST, function(err, hashedPw) {
    if(err) return next(err);
    this.passwordHash = hashedPw;
    next();
  });
});

UserSchema.methods.checkpassword = function(ppw, cb) {
  bcrypt.compare(ppw, this.passwordHash, (err, isMatch) => {
    if(err) return cb(err);
    cb(null, isMatch);
  });
}



module.exports = mongoose.model('User', UserSchema);
