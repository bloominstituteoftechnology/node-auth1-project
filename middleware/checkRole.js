// require('dotenv').config();
// const jwt = require('jsonwebtoken');

module.exports = (role, req, res, next) => {
  console.log(req)
  return function (req, res, next) {
    if (req.decodedToken && req.decodedToken.roles.includes(role)) {
      next();
    } else {
      req.status(403).json({ message: "you don't have permission to access to this resource based on your role" })
    }
  }
}