var bcrypt = require("bcryptjs");
const Users = require("../users/user-model");

module.exports = (req, res, next) => {
  let { username, password } = req.headers;

 username && password
    ? Users.findBy({ username })
      .first()
      .then(user => {
        user && bcrypt.compareSync(password, user.password)
         ? next()
         : res.status(401).json({ message: "Invalid Credentials" });
      })
      .catch(({ name, message, stack }) => {
        res.status(500).json({ name, message, stack });
      })
    : res.status(400).json({ error: "please provide credentials" });
};