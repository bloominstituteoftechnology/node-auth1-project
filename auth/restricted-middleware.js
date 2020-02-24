const bcrypt = require("bcryptjs");

const Users = require("../users/user-model.js");

module.exports = (req, res, next) => {
  let username = req.headers.username;
  let password = req.headers.password;

  if (username && password) {
    Users.findBy(username)
      .first()
      .then(user => {
        console.log(user)
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(({ name, message, stack }) => {
        res.status(500).json({ name, message, stack });
      });
  } else {
    res.status(400).json({ error: "please provide credentials" });
  }
};
