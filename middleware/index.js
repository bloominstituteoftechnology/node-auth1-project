// middleware for users constraints
function registerConstraints(req, res, next) {
  const NAME = req.body.name;
  const CLEARPASSWORD = req.body.password;

  if (!NAME || NAME.length < 1) {
    return next({
      code: 400,
      error: `Please provide a 'name' for the user.`,
    });
  }

  if (NAME.length > 128) {
    return next({
      code: 400,
      error: `The 'name' of the user must be fewer than 128 characters.`,
    });
  }

  if (!CLEARPASSWORD) {
    return next({
      code: 400,
      error: `Please provide a 'password' for the user.`,
    });
  }

  if (CLEARPASSWORD.length < 10) {
    return next({
      code: 400,
      error: `The 'password' of the user must be greater than 10 characters.`,
    });
  }

  // set the req object
  req.NAME = NAME;
  req.CLEARPASSWORD = CLEARPASSWORD;

  next();
}

function loginConstraints(req, res, next) {
  const NAME = req.body.name;
  const CLEARPASSWORD = req.body.password;

  if (!NAME) {
    return next({
      code: 400,
      error: `Please provide a 'name' for the user.`,
    });
  }

  if (NAME.length > 128) {
    return next({
      code: 400,
      error: `The 'name' of the user must be fewer than 128 characters.`,
    });
  }

  if (!CLEARPASSWORD || CLEARPASSWORD.length < 1) {
    return next({
      code: 400,
      error: `Please provide a 'password' for the user.`,
    });
  }

  // set the req object
  req.NAME = NAME;
  req.CLEARPASSWORD = CLEARPASSWORD;

  next();
}

module.exports.registerConstraints = registerConstraints;
module.exports.loginConstraints = loginConstraints;
