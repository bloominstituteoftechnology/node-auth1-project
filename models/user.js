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
    console.log('pre save hook')

    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) return next(err)
        this.password = hash
        next()

    })

})
const userModel = mongoose.model('User', UserSchema, 'users')
module.exports = userModel;