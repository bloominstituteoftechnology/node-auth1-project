const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  const { username, password } = req.headers;
  console.log(req.headers);
  console.log(req.session.user);
  if (req.session && req.session.user) {
    next();
     
  } else {
    res.status(401).json({ message: 'What no cookies?' });
  }
};
