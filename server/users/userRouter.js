const router = require("express").Router();
const User = require("./userModel");

router.get("/",  (req, res) => {
  try {
    const rows =  User.get();
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({ message: `${e}` });
  }
});

module.exports = router;
