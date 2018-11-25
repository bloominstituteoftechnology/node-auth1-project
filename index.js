const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db/dbconfig');

const port = process.env.PORT || 9000;
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to auth I' });
});

server.get('/api/users', async (req, res) => {
  try {
    const response = await db('Users');
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 3);
  creds.password = hash;
  db('Users')
    .insert(creds)
    .then(id => {
      res.status(201).json({ message: `Created user with a id of ${id}` });
    })
    .catch(err => {
      res.status(500).json({ message: 'Bad Request' });
    });
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('Users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: 'Welcome' });
      }
    })
    .catch(err => {
      res.status(401).json({ message: 'Unauthorized' });
    });
});
server.listen(port, () => {
  console.log(`\n === Server listening on ${port}k === \n`);
});
