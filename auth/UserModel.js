const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const UserModel = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true 
    },
    password: {
        type: String,
        required: true,
        minlenght: 5
    },
});

UserModel.pre('save', function(next) {
    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) {
            return next (err); 
        }
        this.password=hash; 
        next(); 
    });
}); 

module.exports = mongoose.model('User', UserModel); 