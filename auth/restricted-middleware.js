module.exports = (req, res, next) => {
    if (req.session.loggedInUser) {
      next();
    } else {
      res.status(400).json({
        message: 'no cookie, OR cookie without a valid session id in the monkey'
      });
    }
  };