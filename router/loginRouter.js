const express = require('express');
const usersDB = require('../data/helpers/usersDB');
const { loginConstraints } = require('../middleware');
const router = express.Router();

const bcrypt = require('bcryptjs');

/* 
  REGISTER API
*/

// add a new user
router.post('/', loginConstraints, async (req, res) => {
  const { NAME, CLEARPASSWORD } = req;

  try {
    const HASH = await usersDB.get(NAME);
    if (HASH) {
      const VALID = await bcrypt.compare(CLEARPASSWORD, HASH.password);
      if (VALID) {
        res.status(200).send(`Logged in`);
      } else {
        res.status(500).send(`You shall not pass!`);
      }
    } else {
      res.status(500).send(`You shall not pass!`);
    }
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

module.exports = router;
