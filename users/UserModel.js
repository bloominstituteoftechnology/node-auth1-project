const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    }
});

userSchema.pre('save', function(next) { //need to use function, not fat arrow becoz it won't look inside userSchema.
    bcrypt.hash(this.password, 12, (error, hash) => { //"this.password" comes from line 11
        if(error) {
            return next(error);
        }
        this.password = hash;
        next(); 
    });
});

//compare inputPassword and the correct password that stored in model
//then pass validatePassword method to userRouter to check if the findOne username input the matched password
userSchema.methods.validatePassword = function(inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};
    

module.exports = mongoose.model('User', userSchema);
