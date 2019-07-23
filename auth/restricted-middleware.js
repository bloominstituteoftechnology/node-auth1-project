// JWT
// const jwt = require("jsonwebtoken");
// const secrets = require('../api/secrets');

// SESSIONS
module.exports = (req, res, next) => {
  if (req.session && req.session.username) {
    next()
  } else {
    res.status(401).json({ message: 'Unauthorized access. Please log in.' })
  }
}

// JWT
// module.exports = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (token) {
//     jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
//       if (error) {
//         // if token is NOT valid
//         res.status(401).json({ message: "Invalid credentials" });
//       } else {
//         // token IS valid
//         req.decodedJwt = decodedToken // adds all decoded info to REQ, including roles!
//         next();
//       }
//     })
//   } else {
//     res.status(401).json({ message: "No token provided!" });
//   }
// };



