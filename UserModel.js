const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    }
});

//hash functionality using bcrypt
UserSchema.pre('save', function(next) {
    console.log("pre save hook");
    bcrypt.hash(this.password, 12, (err, hash) => {
        if(err){
            return next(err);
        }
        this.password = hash;
        next();

    });
});

UserSchema.methods.passwordValidation = function(attempt) {
    return bcrypt.compare(attempt, this.password);
};

const UserModel = mongoose.model("User", UserSchema, "users");

module.exports = UserModel;