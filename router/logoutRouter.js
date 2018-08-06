const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    await req.session.destroy();
    res.status(200).send(`Logged out.`);
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

module.exports = router;
