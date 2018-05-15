import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.pre('save', function(next) {
  // handle hashing here
  bcrypt.hash(this.password, 11, (err, hash) => {
    if (err) return next(err)
    this.password = hash
    return next()
  })
})

UserSchema.methods.isPasswordValid = function(pass) {
  return bcrypt.compare(pass, this.password)
}

export default mongoose.model('User', UserSchema)
