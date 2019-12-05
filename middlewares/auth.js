const bcrypt = require('bcryptjs');

const User = require('../models/User-model');

module.exports = auth = async (req, res, next) => {
  const { username, password } = req.headers;

  try {
    // search db for user
    const user = await User.findBy({ username });

    // if user does not exist, reject
    if (!user) {
      res.status(401).json({ message: 'Authentication is required' });
    }

    // if user password doesn't match hased pw in db, reject
    if (!bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ message: 'Authentication is required' });
    }

    // otherwise, continue
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
