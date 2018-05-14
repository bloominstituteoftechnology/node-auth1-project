const mongoose = require("mongoose");
const bcrypt = requrie("bcrypt");

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
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  console.log('pre save hook');
  bcrypt.hash(this.password, 11, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    return next();
  })
})

module.exports = mongoose.model("User", UserSchema);
