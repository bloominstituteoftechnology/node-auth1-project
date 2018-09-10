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

module.exports = {
  reqBodyCheck,
};
