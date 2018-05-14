const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
    },
    password: {
        type: String,
        required: true,
    },
});

//middleware
userSchema.pre('save', function(next) {
    // console.log('pre save hook');
    bcrypt.hash(this.password, 11, (err, hash) => {
        if(err) {
            return next(err);
        }

        this.password = hash;

        return next(); //goes on to save to the db
    });
});

module.exports = mongoose.model('User', userSchema);