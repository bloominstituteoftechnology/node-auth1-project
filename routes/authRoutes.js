const router = require('express')();
const db = require('../data/db');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const credentials = req.body;

  try {
    const user = await db('users')
      .where({ username: credentials.username })
      .first();

    if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
      res.status(401).json({ message: 'Incorrect Credentials' });
    } else {
      res.status(200).json({ user: user.username });
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post('/register', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  db('users')
    .insert(user)
    .then(ids => {
      db('users')
        .first()
        .where({ id: ids[0] })
        .then(user => res.status(201).json(user))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
