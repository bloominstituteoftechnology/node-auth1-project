const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Schema is constructor 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true, // creates unique index for document 
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
    },
});

// pre save hook - Hooks: think of ornaments on a Christmas tree
// important to 'NOT' write arrow function to safe guard against issues with '.this'
// arrow functions & this keyword context: running this will set 'this' to the global context
// regular function & this keyword context: running this in the context of the userSchema. When we use this.password we are dynamically seting the context
userSchema.pre('save', function(next) {
    //console.log('pre save hook');
    bcrypt.hash(this.password, 12, (err, hash) => {
        //it's actually 2^12 rounds
        if (err) {
            return next(err);
        }
        this.password = hash;
        next(); // carries out the save 
    });
});


module.exports = mongoose.model('User', userSchema); // third argument will lowercase/pluralize the 1st arg to create a new collection. If exsisting database, 3rd agrument will map Model (User) to specific exsisting collection.