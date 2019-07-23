module.exports = (req, res, next) => {
    // check that the client has a session
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'You shall not pass!' });
    }
  };