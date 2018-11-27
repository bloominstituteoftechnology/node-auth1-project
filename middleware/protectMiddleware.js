module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    // checks for user id to provide access if user is logged in
    next();
  } else {
    // deny access if user is not logged in
    res.status(401).json({ message: 'please log in' })
  }
}