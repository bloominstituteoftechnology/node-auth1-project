const jwt = require("jsonwebtoken");
const secret = require('../api/secrets').jwtSecret;

module.exports = (req, res, next) => {
  try {
    if (req && req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: "Invalid credentials" })
    }
  } catch(error) {
    res.status(500).json({ message: 'Server error' })
  }
};

const token = req.headers.authorization;

if (token) {
  jwt.verify(token, secret)
} else {
  res.status(401).json({ message: "Invalid credentials" });
}
