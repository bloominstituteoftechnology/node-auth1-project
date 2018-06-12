const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }, 
    password: {
        type: String,
        required: true,
        minlength: 4
    },
}); 

UserSchema.pre('save', function(next){
    console.log('pre save hook')
   
    bcrypt.hash(this.password, 12, (err, hash) => {
        if(err){
            return next(err);
        }
        this.password = hash;

        next();
    });
});

UserSchema.methods.validatePassword = function(passwordGuess){
   return bcrypt.compare(passwordGuess, this.password);
};



module.exports = mongoose.model('User', UserSchema, 'users')