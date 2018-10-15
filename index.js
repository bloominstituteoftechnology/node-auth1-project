const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Its Alive!');
});

server.post('/register', (req, res) => {
    const credentials = req.body;
  
    // hash the password
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    // then save the user.
    db('users')
      .insert(credentials)
      .then(ids => {
        const id = ids[0];
        res.status(201).json({ newUserId: id });
      })
      .catch(err => {
        res.status(500).json(err);
      });
});

server.post('/login', (req, res) => {
    const creds = req.body;
  
    db('users')
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          // found the user.
          res.status(200).json({ welcome: user.username });
        } else {
          res.status(401).json({
            message: `You shall not pass... as you are not authenticated.`,
          });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
});

const port = 3300;

server.listen(port, () => {
    console.log(`\nAPI running on port ${port}\n`)
});