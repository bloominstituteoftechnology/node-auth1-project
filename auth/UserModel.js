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
userSchema.pre('save', function(cat) { //before the document gets saved we want this function to execute.
    //console.log('pre save hook');
    bcrypt.hash(this.password, 12, (err, hash) => {
        //it's actually 2^12 rounds
        if (err) {
            return cat(err);
        }
        this.password = hash;
        cat(); // carries out the save event
    });
});

//writing a method for the schema to handle login
// returns a promise 
// must not be an arrow function to preserve corrent 'this' context 
userSchema.methods.validatePassword = function (passwordGuess) {
    return bcrypt.compare(passwordGuess, this.password);
}

module.exports = mongoose.model('User', userSchema); // third argument will lowercase/pluralize the 1st arg to create a new collection. If exsisting database, 3rd agrument will map Model (User) to specific exsisting collection.

