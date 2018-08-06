const express = require('express');
const usersDB = require('../data/helpers/usersDB');
const { loginConstraints } = require('../middleware');
const router = express.Router();

const bcrypt = require('bcryptjs');

/* 
  LOGIN API
*/

// login a user
router.post('/', loginConstraints, async (req, res) => {
  // req set in loginConstraints
  const { NAME, CLEARPASSWORD } = req;

  try {
    const USER = await usersDB.getByName(NAME);
    if (USER) {
      const VALID = await bcrypt.compare(CLEARPASSWORD, USER.password);
      if (VALID) {
        req.session.userid = USER.id;
        res.status(200).send(`Logged in`);
      } else {
        res.status(500).send(`You shall not pass!`);
      }
    } else {
      // error with the user, but don't let the hackers know!
      res.status(500).send(`You shall not pass!`);
    }
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

module.exports = router;
