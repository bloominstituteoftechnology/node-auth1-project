import mongoose, { Schema } from 'mongoose'
// import bcrypt from 'bcrypt'

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
  console.log(this.password)
  next()
})

const UserModel = mongoose.model('User', UserSchema)
export default UserModel
