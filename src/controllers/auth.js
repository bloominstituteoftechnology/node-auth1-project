const User = require('../user');
const { sendSafeUser } = require('../utils/response');
const { sendUserError } = require('../utils/error');
const { comparePassword } = require('../utils/passwordHash');

module.exports = {
  registerUser: async (req, res) => {
    const { username, password: passwordHash } = req.body;
    const newUser = new User({ username, passwordHash });
    try {
      const success = await newUser.save();
      /* eslint no-underscore-dangle: 0 */
      req.session.user = success._id;
      sendSafeUser(success, res);
    } catch (error) {
      sendUserError(error, res);
    }
  },
  loginUser: async (req, res) => {
    const { username, password } = req.body;
    try {
      const foundUser = await User.findOne({ username });
      if (foundUser) {
        const passwordMatch = await comparePassword(password, foundUser.passwordHash);
        if (passwordMatch) {
          req.session.user = foundUser._id;
          return sendSafeUser(foundUser, res);
        }
        return sendUserError('Incorrect password', res);
      }
      sendUserError('User does not exist', res);
    } catch (error) {
      sendUserError(error, res);
    }
  }
};
