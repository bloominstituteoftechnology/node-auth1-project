const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

<<<<<<< HEAD
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
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

module.exports = mongoose.model('User', UserSchema)
=======
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{type:String,required:true,unique:true},
    password: {type:String,required:true}
})

UserSchema.pre('save',function(next){
    bcrypt.hash(this.password,11,(err,hash) => {
        if (err) {
            return next(err)
        }
        this.password = hash
        return next()
    })
})



module.exports = mongoose.model('User',UserSchema);
>>>>>>> d31448f47d59c6764acb7fedb3b258fc95ebc42d
