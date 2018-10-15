const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send("It's allliiiiive!!!");
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            res.status(200).json({ message: `Logged in` });
        } else {
            res.status(401).json({ message: "You shall not pass!"});
        }
    })
    .catch(err => res.status(500).json({err}));
})

server.post('/api/register', (req, res) => {
    const credentials = req.body;

    // hash password
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    // save user
    db('users').insert(credentials).then(ids => {
        const id = ids[0];
        res.status(201).json({ newUserId: id });
    })
    .catch(err => {
        res.status(500).json({err});
    })
})

// this endpoint needs to be protected, only auth'd users should see it
server.get('/api/users', (req, res) => {
    db('users')
      .select('id', 'username')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

const port = 8888;
server.listen(port, () => console.log(`API running on ${port}`));