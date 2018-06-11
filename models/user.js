const mongoose = require('mongoose')
bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        minlength: 4,
        type: String,
        required: true
    }
})

UserSchema.pre('save', function (next) {
    // console.log('pre save hook')

    bcrypt.hash(this.password, 12, (err, hash) => {
        // console.log(this.password)
        if (err) {
            return next(err)
        }
        this.password = hash
        next()

    })

})

module.exports = mongoose.model('User', UserSchema, 'users');