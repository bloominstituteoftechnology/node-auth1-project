const Users = require("../users/users-model");
const bcrypt = require("bcryptjs");

const authRequired = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    //invalid creds
    res.status(400).json({ messege: "Invalid Credentials" });
  }
};

// const authRequired = (req, res, next) => {
//   const { username, password } = req.headers;

//   if (username && password) {
//     Users.findBy({ username })
//       .first()
//       .then(user => {
//         if (user && bcrypt.compareSync(password, user.password)) {
//           next();
//         } else {
//           //invalid creds
//           res.status(400).json({ messege: "Invalid Credentials" });
//         }
//       })
//       .catch(err => {
//         res.status(500).json({ messege: err });
//       });
//   }
// };

module.exports = authRequired;
