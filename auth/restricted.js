const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

function restricted(req, res, next) {
  const { username, password } = req.headers;
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res
            .status(401)
            .json({ message: "Invalid Credentials. You shall not pass!" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: "Did you even provide a password?" });
      });
  } else {
    res.status(400).json({ message: "Why didn't you put in credentials?" });
  }
}

module.exports = restricted;
