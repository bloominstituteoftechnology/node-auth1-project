const bcrypt = require("bcryptjs");
const express = require("express");
const usersModel = require("./users-model");

const router = express.Router();

restricted = () => {
  const authError = {
    message: "Invalid credentials"
  };
  return async (req, res, next) => {
    try {
      const { username, password } = req.headers;
      if (!username || !password) {
        return res.status(401).json(authError);
      }

      const user = await usersModel.findBy({ username }).first();
      if (!user) {
        return res.status(401).json(authError);
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json(authError);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

router.get("/", restricted(), async (req, res, next) => {
  try {
    const users = await usersModel.find();

    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
