module.exports.protectRoute = (req, res, next) => {
  req.session && req.session.userId
    ? next()
    : res.status(401).json({ message: 'You shall not pass!' });
};
