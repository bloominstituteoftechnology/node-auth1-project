const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const BCRYPT_COST = 11;

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/users", { useMongoClient: true });

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

// UserSchema.pre('save', function(next) {
//   console.log('pre save hook');
//   const user = this;

//   if (user.isModified('passwordHash')) {
//     bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
//       if (err) return next(err);

//       bcrypt.hash(user.passwordHash, salt, (error, hash) => {
//         if (error) return next(error);
//         user.password = hash;
//         next();
//       });
//     });
//   } else {
//     next();
//   }
// });

UserSchema.pre("save", function(next) {
  console.log("pre save hook");
  bcrypt.hash(this.passwordHash, 11, (err, hash) => {
    // 2 ^ 16.5 ~ 92.k rounds of hashing
    if (err) {
      return next(err);
    }

    this.passwordHash = hash;

    return next();
  });
});

UserSchema.methods.comparePassword = function(passCheck) {
  return bcrypt
    .compare(passCheck, this.passwordHash);
};

module.exports = mongoose.model("User", UserSchema);
