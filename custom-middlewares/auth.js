// check if user is logged in
const bcrypt = require('bcrypt');

const Users = require('../users/users-module.js');

async function restricted(req, res, next) {
  let { username, password } = req.headers;
  try {
    if (username && password) {
      const userData = await Users.findUserBy({ username });
      if (userData && bcrypt.compareSync(password, userData.password)) {
        next();
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    } else {
      res.status(400).json({ message: 'No credentials provided.' });
    }    
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = restricted;