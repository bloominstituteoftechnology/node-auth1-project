const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { protected } = require('./middleware.js')

const db = require('../data/dbConfig.js')

const USERID = 'userId';

router.get('/', (req, res) => {
  res.status(200).json({ message: 'api' });
})

const login = (req, res) => {
  const creds = req.body 

  db('users').where({username: creds.username}).first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.user = user.id;
        res.status(200)
          .json({message: 'welcome'})
      } else {
        res.status(401).json({message: 'Failed to authenticate'})
      }
    })
    .catch(err => res.json(err));
}

const register = (req, res) => {
  const { username, password } = req.body;
  const saltLength = 14;
  const hashedPass = bcrypt.hashSync(password, saltLength)
  const userObj = {username, password: hashedPass}
  db('users').insert(userObj)
    .then(ids => {
      res
        .status(201)
        .json({ids, hashedPass})
    })
    .catch(err => res.json(err));

}

const getUsers = async (req, res) => {
  try {
    const userMatchingId = await db('users').where({id: userId}).first()
    console.log(userIdInDb)
    if (userMatchingId.id) {
      const users = await db('users').select('id', 'username', 'password')
      res.status(200).json(users);
    }
    res.status(500).json({message: 'You shall not pass!'});
  }
  catch(err) {
    res.send(err)
  };
}

const echo = (req, res) => {
  res.status(200).json({
    message: 'hey this endpoint work!',
    params: req.params,
    query: (req.query ? req.query : ''),
    body: req.body
  });
}

router.post('/login', login)
router.post('/register', register)
router.get('/users', getUsers)

module.exports = router;