module.exports = (req, res, next) => {
  // is the user logged in === do we have information about the user in our session
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
};
