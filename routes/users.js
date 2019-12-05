const express = require('express');
const router = express.Router();

//@ROUTE            GET /api/users
//@DESC             gets all users
//@ACCESS           Private
router.get('/users', (req, res) => {
  res.send('Gets users');
});

module.exports = router;
