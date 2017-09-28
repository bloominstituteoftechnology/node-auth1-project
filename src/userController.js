const User = require('./user');
const bcrypt = require('bcrypt');

const errorHandler = (err, res) => res.status(422).json({ error: err });

module.exports = {
  createNewUser: (req, res) => {
    const { username, passwordHash } = req.body;
    const newUser = new User({ username, passwordHash });
    newUser.save(err => (err ? errorHandler(err, res) : res.json(newUser)));
  },
  logIn: (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }, (errU, user) => {
      if (errU || !user) return errorHandler(errU = 'user not found', res);
      bcrypt.compare(password, user.passwordHash, (errP, valid) => {
        if (errP || !valid) return errorHandler(errP = 'password not valid', res);
        req.session.user = user;
        res.json({ success: true });
      });
    });
  }
};
