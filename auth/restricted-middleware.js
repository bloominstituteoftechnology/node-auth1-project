const restricted = (req, res, next) => {
    if (req.session.loggedInUser) {
      next();
    } else {
      res.status(400).json({
        message: 'Please login to get a cookie'
      });
    }
  };
  module.exports = restricted;