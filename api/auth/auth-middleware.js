const User = require('../users/users-model');

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({
      message: 'You shall not pass!',
      status: 401
    });
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const { username } = req.body;
    const exist = await User.findBy({ username });
    if (exist.length >= 1) {
      next({
        message: 'Username taken',
        status: 422
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const { username } = req.body;
    const exist = await User.findBy({ username });
    if (!exist) {
      next({
        message: 'Invalid credentials',
        status: 401
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

async function checkPasswordLength(req, res, next) {
  try {
    const { password } = req.body;
    if (!password || password.length <= 3) {
      next({
        message: 'Password must be longer than 3 chars',
        status: 422
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
};
