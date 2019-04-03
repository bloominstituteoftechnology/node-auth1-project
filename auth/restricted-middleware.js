const jwt = require("jsonwebtoken");
const secrets = require('../api/secrets');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
      if (error) {
        // if token is NOT valid
        res.status(401).json({ message: "Invalid credentials" });
      } else {
        // token IS valid
        // req.decodedJwt = decodedToken
        next();
      }
    })
  } else {
    res.status(401).json({ message: "No token provided!" });
  }
};


