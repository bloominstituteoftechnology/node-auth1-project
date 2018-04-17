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
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  console.log('pre save hook');
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(BCRYPT_COST, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});


UserSchema.methods.comparePassword = function (passCheck, cb) {
  bcrypt.compare(passCheck, this.password, (err, isMatch) => {
    if (err) throw cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
