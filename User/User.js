const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    'user': {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    'password': {
        type: String,
        required: true
    }
})

userSchema.pre('save', function(next){
    bcrypt.hash(this.password, 5, (hash, err) => {
        if (err) {
            next(err);
        }
        this.password = hash;
    });
});