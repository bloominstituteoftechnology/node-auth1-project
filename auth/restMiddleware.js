const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");

module.exports = function restricted(req, res, next) {
   
    const { username, password } = req.headers;
  
  
    if (username && password) {
      Users.findBy({ username })
        .first()
        .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
            next();
          } else {
            res.status(401).json({ message: 'Invalid Credentials' });
          }
        })
        .catch(error => {
          res.status(500).json({ message: 'Unexpected error' });
        });
    } else {
      res.status(400).json({ message: 'No credentials provided' });
    }
  } 