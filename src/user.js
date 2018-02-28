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
  // TODO: fill in this schema
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    index: true
  }
});

UserSchema.pre("save", function(next) {
  console.log(this.password);
  bcrypt.hash(this.password, BCRYPT_COST).then(hashedPass => {
    this.password = hashedPass;
    next();
  });
});

UserSchema.methods.checkPassword = function(plainTextPass, cb) {
  bcrypt.compare(plainTextPass, this.password, (err, isMatch) => {
    if (err) return err;
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
