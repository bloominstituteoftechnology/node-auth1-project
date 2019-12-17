  
const authenticated = (req, res, next) => {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: "You don't have the valid credentials." });
    }
  };
  
  module.exports = authenticated;