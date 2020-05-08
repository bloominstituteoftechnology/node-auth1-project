const express = require("express");
const db = require("../data/db-config");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.status(200).send(`<h1>Welcome</h1>`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
