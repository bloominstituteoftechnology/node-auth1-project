const express = require("express");
const router = express.Router();
const restrictedMiddleware = require("../middleware/restricted");

router.get("/profile", restrictedMiddleware.hasLoggedIn, (req, res) => {
  res.send(
    "<h1>Welcome to the Restricted Area</h1><p>This area is only available to authorised users</p>"
  );
});

router.get("/users", restrictedMiddleware.hasLoggedIn, (req, res) => {
  res.send(
    "<h1>Welcome to the Restricted Area</h1><p>This area is only available to authorised users</p>"
  );
});

module.exports = router;
