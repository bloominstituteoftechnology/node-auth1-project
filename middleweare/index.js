const bcrypt = require('bcryptjs');
const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    res.status(401).json({ message: 'invalid credentials' });
  } else {
    Users.findBy({ username })
      .first()
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Problem with the db', error: err });
      });
  }
};


// module.exports = (req, res, next) => {
//   const { username, password } = req.headers;
//   if (!(username && password)) {
//     res.status(401).json({ message: 'invalid credentials' });
//   } else {
//     Users.findBy({ username })
//       .first()
//       .then((_user) => {
//         if (_user && bcrypt.compareSync(password, _user.password)) {
//           next();
//         } else {
//           res.status(401).json({ messege: 'Invalid Credentials' });
//         }
//       })
//       .catch((err) => { res.status(500).json({ messege: err }); });
//   }
// };
