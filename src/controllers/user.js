const User = require('../user');
const { sendSafeUser } = require('../utils/response');
const { sendUserError } = require('../utils/error');

module.exports = {
  getAuthenticatedUser: async (req, res) => {
    try {
      const user = await User.findById(req.session.user);
      sendSafeUser(user, res);
    } catch (error) {
      sendUserError(error, res);
    }
  }
};
