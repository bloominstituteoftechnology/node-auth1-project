module.exports = {
  hasLoggedIn: (req, res, next) => {
    if (!req.session.username) {
      return res.status(401).json({ message: "You shall not pass!" });
    }
    next();
  }
};
