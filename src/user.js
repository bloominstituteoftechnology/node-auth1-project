const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {}
mongoose.modelSchemas = {}

mongoose.Promise = Promise
mongoose
  .connect('mongodb://localhost/users', { useMongoClient: true })
  .then(() => {
    console.log('\n=== connected to MongoDB ===\n')
  })
  .catch(err => console.log('database connection failed', err))

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  }
})
username
password

userId
username
hashPassword

UserSchema.pre('save', function (next) {
  //! How can I pass BCRYPT_COST?
  bcrypt.hash(this.passwordHash, 11, (err, hash) => {
    if (err) {
      return next(err)
    }
    this.passwordHash = hash
    return next()
  })
})

UserSchema.methods.isPasswordValid = function (passwordGuess) {
  return bcrypt.compare(passwordGuess, this.passwordHash)
};

module.exports = mongoose.model('User', UserSchema)
