const express = require('express');
const router = express.Router();
cosnt User = require('./User');

router.get('/users', (req, res) => {
    User.find()
      .then(users => {
          res.status(200).json(users);
      })
      .catch(err => res.sendStatus(500));
})

router.get('/other', (req, res) => {
    res.status(200).json({ msg: 'RESTRICTED ROUTE OTHER' });
})
router.get('/something', (req, res) => {
    res.status(200).json({ msg: 'RESTRICTED ROUTE SOMETHING' });
})
router.get('/a', (req, res) => {
    res.status(200).json({msg: 'RESTRICTED ROUTE A'});
})

module.exports = router;