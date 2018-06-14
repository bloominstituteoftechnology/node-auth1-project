const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
})

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 11, (err, hash) => {
    if (err) {
      return next(err)
    }
    this.password = hash
    return next()
  })
})

UserSchema.methods.comparePassword = function(plaintextPassword, cb) {
  bcrypt.compare(plaintextPass, this.password)
  .then( isMatch => {
    cb(isMatch)
  })
  .catch( err => {
    console.log(err)
  })
}

module.exports = mongoose.model('User', UserSchema)
