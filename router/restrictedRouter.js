const express = require('express');
const usersDB = require('../data/helpers/usersDB');
const router = express.Router();

/* 
  USERS API
*/

// get all users
router.get('/', async (req, res) => {
  let ID = req.session.userid;
  if (ID) {
    try {
      const user = await usersDB.get(ID);
      res.status(200).send(`Welcome, ${user.name}`);
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  } else {
    res.status(401).send(`You must be logged in to continue`);
  }
});

module.exports = router;
