const express = require("express");
const router = express.Router();
const db = require("./authModel");
const restrict = require("./restrict");

router.post("/register", async (req, res, next) => {
  try {
    const data = { user_name: req.body.user_name, password: req.body.password };
    const newUser = await db.createUser(data);
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;