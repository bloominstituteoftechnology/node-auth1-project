const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
username:{
    type: String,
    uniqure: true,
    required: true,
    lowercase:true,
},
password:{
    type: String,
    required: true,

},
})

userSchema.pre('save', function(next){
    console.log('pre save hook')
    bcrypt.hash(this.password, 11, (err,hash)=>{
        if (err){
            return next(err);
        }
        this.password = hash;
        return next();
    })
})
module.exports = mongoose.model('User', userSchema)