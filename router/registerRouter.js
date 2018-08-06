const express = require('express');
const registerDB = require('../data/helpers/registerDB');
const { registerConstraints } = require('../middleware');
const router = express.Router();

const bcrypt = require('bcryptjs');

/* 
  REGISTER API
*/

// add a new user
router.post('/', registerConstraints, async (req, res) => {
  const { NAME, CLEARPASSWORD } = req;

  try {
    // hash the password
    const HASH = await bcrypt.hash(CLEARPASSWORD, 14);
    const USER = { name: NAME, password: HASH };
    try {
      const response = await registerDB.insert(USER);
      if (response) {
        res
          .status(200)
          .json({ message: `User with id:${response.id} has been added.` });
      } else {
        res.status(400).json({
          error: `Undetermined error adding project.`,
        });
      }
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

module.exports = router;
