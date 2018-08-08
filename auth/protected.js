module.exports = {
  protected: function(req, res, next) {
    console.log('session from within middleware', req.session);
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
  }
};
