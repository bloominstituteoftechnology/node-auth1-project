const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
})

.pre('save', function(next){
    bcrypt.hash(this.password, 11, (err, hashWord) => {
        if(hashWord) {
            this.password = hashWord
            next()
        } else {
            console.log('error', err)
            next()
        }
    })
})

module.exports = mongoose.model('User', User)