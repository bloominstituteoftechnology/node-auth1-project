const db = require("../users/users-model");

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
async function restricted(req, res, next) {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "You shall not pass!" });
    }
    next();
  } catch (err) {
    next(err);
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const { username } = req.body;
    const user = await db.findBy({ username }).first();

    if (user) {
      return res.status(422).json({
        message: "Username taken",
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const { username } = req.body;
    const user = await db.findBy({ username }).first();

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const password = req.body.password;

  if (!password || password.length < 4) {
    res.status(422).json({
      message: "Password must be longer than 3 chars",
    });
  }
  next();
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
