const reqBodyCheck = (req, res, next) => {
  if (req.body.username.length >= 1 || req.body.password.length) {
    next();
  } else {
    try {
      throw new Error();
    } catch (err) {
      err.code = 406;
      next(err);
    }
  }
};

const protected = (req, res, next) => {
  if (req.session && req.session.username) {
    next();
  } else {
    try {
      throw new Error();
    } catch (err) {
      err.code = 401;
      next(err);
    }
  }
};

module.exports = {
  reqBodyCheck,
  protected,
};
