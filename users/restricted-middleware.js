module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({
      message: "You Shall Not Pass"
    });
  }
};

// const bcypt = require("bcryptjs");
// const Users = require("./users-model");

// module.exports = function restricted(req, res, next) {
//   const { username, password } = req.headers;
//   if ((username, password)) {
//     Users.findUser(req.headers)
//       .then(user => {
//         if (user && bcypt.compareSync(password, user.password)) return next();
//         else {
//           return res.status(401).json({
//             message: "You shall not pass!"
//           });
//         }
//       })
//       .catch(error => {
//         res.status(500).json({
//           message: "Error Getting Data.."
//         });
//       });
//   } else {
//     res.status(400).json({
//       message: "please Provide Username and Password"
//     });
//   }
// };
