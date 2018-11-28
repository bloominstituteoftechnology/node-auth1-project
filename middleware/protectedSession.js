module.exports = (req, res, next) => {
  req.session && req.session.userId
  ? next()
  : res.json({ error: 'try again' });
}