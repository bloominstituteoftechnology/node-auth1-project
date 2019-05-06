const bcrypt = require("bcryptjs");

const users = require("../api/helpers/users-helpers.js");

function protected(req, res, next) {
  const { username, password } = req.headers;
  if (username && password) {
    users
      .findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      });
  } else {
    res.status(400).json({ message: "Please provide your login credentials" });
  }
}

module.exports = protected;
