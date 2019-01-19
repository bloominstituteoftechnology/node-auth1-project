module.exports = {
  protect: function (req, res, next) {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.status(400).send('access denied')
    }
  }
}