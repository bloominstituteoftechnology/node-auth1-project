const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json(err);
      }
      res.json("good bye ");
    });
  }
});

module.exports = router;
