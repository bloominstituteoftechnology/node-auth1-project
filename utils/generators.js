  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function token(user) {
  const payload = {
    id: user.id,
    username: user.username
  };
  const secret = process.env.SECRET_OR_KEY;
  const options = { expiresIn: '1d' };
  return jwt.sign(payload, secret, options);
}

module.exports = { password, token };