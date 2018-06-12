const mongoose = require('mongoose');
const bcrypt = ('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowerCase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
});

// pre => validate => post => pre => save => post
userSchema.pre('save', function (next) {
    console.log('pre save hook');
    
    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) {
            return next(err);
        }
        this.password = hash;
    })
    
    next();
});

module.exports = mongoose.model('User', userSchema);