const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.pre( 'save', function(next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) {
            return next(err)
        }
        this.password = hash
        next()
    })
})

userSchema.methods.isPasswordValid = function(password) {
    return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('userModel', userSchema)