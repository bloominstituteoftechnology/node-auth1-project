const router = require('express')();
const auth = require('../auth/protected');
const db = require('../data/db');

router.get('/', (req, res) => {
  console.log(req.session);
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
