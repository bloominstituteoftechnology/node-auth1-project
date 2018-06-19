const mongoose = require('mongoose');
const bcrtyp = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        uniqure: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
});

userSchema.pre('save', function(next) {
    console.log('pre save hook');
    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) {
            return next(err);
        }
        this.password = hash;
        next();
    });
});


module.exports = mongoose.model('User', userSchema);