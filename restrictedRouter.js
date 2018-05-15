const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("success accessing restricted router");
});

module.exports = router;