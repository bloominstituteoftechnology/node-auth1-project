// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

const express = require("express");
const bcrypt = require("bcryptjs");
const users = require("../users/users-model");
const router = express.Router();
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require("./auth-middleware");

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post(
  "/api/auth/register",
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const newUser = await users.add({
        username,
        password: await bcrypt.hash(password, 10),
      });

      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
);

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post(
  "/api/auth/login",
  checkUsernameExists,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await users.findBy({ username }).first();
      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      req.session.user = user;

      res.status(200).json({
        message: `Welcome ${user.username}!`,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get("/api/auth/logout", (req, res, next) => {
  if (req.session && req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.json("you can not leave");
      } else {
        res.status(204).json({ message: "logged out" });
      }
    });
  } else {
    res.status(200).json({ message: "no session" });
  }
});

module.exports = router;

// Don't forget to add the router to the `exports` object so it can be required in other modules
