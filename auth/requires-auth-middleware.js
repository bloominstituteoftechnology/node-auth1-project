const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");

module.exports = (req, res, next) => {
  let { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
          //check that the password is valid
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(error => {
        res
          .status(500)
          .json({ message: "ran into an error, please try later" });
      });
  } else {
    res.status(400).json({ message: "please provide credentials" });
  }
};
