const jwt = require('jsonwebtoken')
const secret = 'Super Secret Squirrels Secret'

const makeToken = (user) => {
    const payload = {
        sub: user._id,
        name: user.username
    }
    return jwt.sign(payload, secret)

}
module.exports = {
   makeToken
}