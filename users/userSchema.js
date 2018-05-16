// require the packages we need: Mongoose and bCrypt
const mongoose = require('mongoose'); // to communicate the schema with the database
const bcrypt = require('bcrypt'); // to hash passwords

const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

// The schema above be written as follows:

// const definitions = {
//     username: username: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true
//     }
// }
// const options = {
//     ...
// }
// const userSchema = new mongoose.Schema({ definitions,options })


// create a lifecycle hook that starts on the pre-save function of server.js, which hashs the password
// used in server.js line 64-71
userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 11, (err, hash) => {
        if (err) {
            return next(err);
        } 
            this.password = hash;
            return next();
    });
});

// create a function to compare passwords for authentication purposes 
// used in line 77
userSchema.methods.isPasswordValid = function(passwordAttempt) {
    return bcrypt.compare(passwordAttempt, this.password);
}

// Export the schema as a model for use in other files
module.exports = mongoose.model('User', userSchema, 'users')