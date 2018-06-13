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
>>>>>>> 360402e1f7b1d6cd6d84c709b10b967f3bbfaddc
