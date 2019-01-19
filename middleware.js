module.exports = {
  protect: function (req, res, next) {
    if (req.session && req.session.userID) {
      next();
    } else {
      res.status(400).send('access denied')
    }
  }
}