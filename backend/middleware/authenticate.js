module.exports = (req, res, next) => {
  console.log(req.session);
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(400).send('access denied');
  }
}