// projectsRoutes.js
const express = require('express')

const db = require('../../data/dbConfig.js')
const { protected } = require('../middleware.js')

const router = express.Router();
const getUsers = async (req, res) => {
  try {
    const users = await db('users').select('id', 'username', 'password')
    res.status(200).json(users);
  }
  catch(err) {
    res.status(500).json({message: 'You shall not pass!'});
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
router.get('/users', getUsers)
router.use('/*', echo);
router.post('/', echo);
router.get('/:id', echo);
router.get('/something', );
router.get('/other', echo);

module.exports = router;