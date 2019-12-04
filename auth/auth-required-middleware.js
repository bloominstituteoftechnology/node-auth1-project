const Users = require("../users/users-model");
const bcrypt = require("bcryptjs");

const authRequired = (req, res, next) => {
  const { username, password } = req.headers;
  Users.findBy({ username })
    .first()
    .then(_user => {
      if (_user && bcrypt.compareSync(password, _user.password)) {
        next();
      } else {
        //invalid creds
        res.status(400).json({ messege: "Invalid Credentials" });
      }
    })
    .catch(err => {
      res.status(500).json({ messege: err });
    });
};

module.exports = authRequired;
