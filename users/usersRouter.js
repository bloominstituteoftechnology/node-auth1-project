const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ users: "users here" });
});

module.exports = router;
