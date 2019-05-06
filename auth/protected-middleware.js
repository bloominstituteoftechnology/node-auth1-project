const bcrypt = require("bcryptjs");
const Users = require("../api/user/user-model");

function protected(req, res, next) {
  const { username, password } = req.headers;
  
  if (username && password) {
    Users
      .findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ mess: "invalid creds" });
        }
      })
      .catch(err => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ mess: "invalid creds" });
  }
}

module.exports = protected;
