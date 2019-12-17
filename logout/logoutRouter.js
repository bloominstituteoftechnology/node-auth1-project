const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.json({
          message: "you can't logout"
        });
      } else {
        res.status(200).json({
          message: "you Logged Out"
        });
      }
    });
  } else {
    res.status(200).json({
      message: "no session to destroy"
    });
  }
});

module.exports = router;
