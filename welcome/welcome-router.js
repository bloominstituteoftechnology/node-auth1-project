const express = require("express");
const router = express.Router();

//GET welcome /8000 endpoing
router.get("/", (req, res) => {
  res.json({ API: "Api is working now" });
});

module.exports = router;
