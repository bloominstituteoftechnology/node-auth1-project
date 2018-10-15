module.exports = {
  // hasLoggedIn clause
  hasLoggedIn: (req, res, next) => {
    // check if the session username is active
    if (!req.session.username) {
      return res.status(401).json({ message: "You shall not pass!" });
    }
    next();
  }
};
