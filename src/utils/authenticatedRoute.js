const { sendUserError } = require('../utils/error');

module.exports = {
  authenticatedRoute: (req, res, next) => {
    /* eslint no-underscore-dangle: 0 */
    const isAuthenticated = req.session.user;
    if (isAuthenticated) return next();
    return sendUserError('User must be authenticated', res);
  }
};
