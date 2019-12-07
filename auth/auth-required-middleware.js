// //? s36
// const Users = require('../users/users-model.js');

// //? s37
// const bcrypt = require('bcryptjs');

// //? s38
// module.exports = (req, res, next) => {
//   console.log('here');
//   const { username, password } = req.headers;
//   console.log(username, password);

//   if (username && password) {
//     Users.findBy({ username })
//       .first()
//       .then(_user => {
//         if (_user && bcrypt.compareSync(password, _user.password)) {
//           next();
//         } else {
//           //invalid creds
//           res.status(401).json({ message: 'Invalid Credentials' });
//         }
//       })
//       .catch(err => {
//         console.log('login error', error);
//         res.status(500).json({ message: err });
//       });
//   } else {
//     res.status(400).json({ message: 'please provide credentials' });
//   }
// };

