// DEPENDENCIES
// ==============================================
const config = require('./authConfig');

// AUTH MIDDLEWARE
// ==============================================
module.exports = {
  protected: function(req, res, next) {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json(config.AUTH_FAIL);
    }
  }
};
