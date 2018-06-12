const express = require('express');
const User = require('./User');

const router = express.Router();

router.get('/', (req, res) => {
    let query = User.find()
      .sort('username')
    query.then(users = res.status(200).json(users))
      .catch( err => res.sendStatus(500));
})

router.post('/', (req, res) => {
    const newUser = req.body;
    const { username, password } = req.body;
    const user = new User(newUser);
    user.save()
      .then(user => {
          res.status(201).json(user);
      })
      .catch(err => {
          res.status(500).json(err);
      })
})

module.exports = router;