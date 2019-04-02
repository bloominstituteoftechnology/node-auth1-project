const bcrypt = require('bcryptjs');

const Users = require('./users/users-model.js');

module.exports = (req, res, next) => {
  const { username, password } = req.headers;
  
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).jason({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ error: "Please include a username and password" });
  }
};