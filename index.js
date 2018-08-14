const express = require('express');

const db = require('./data/db');

const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json());

server.post('/register', (req, res) => {
  const user = req.body;
  //hash password inside of post route
  // and then store user in database
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  db('users')
    .insert(user)
    .then(function(ids) {
      db('users')
        .where({ id: ids[0] })
        .first()
        .then((user) => {
          res.status(201).json(user);
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// server.post('/login', (req, res) => {
//   const credentials = req.body;

//   db('users')
//     .where({ username: credentials.username })
//     .first()
//     .then(function(user) {
//       const passwordMatch = bcrypt.compareSync(credentials.password, user.password);
//       if (!user || !passwordMatch) {
//         return res.status(404).json({ error: 'Incorrect credentials' });
//       }

//       db('users')
//         .where({ id: ids[0] })
//         .first()
//         .then((user) => {
//           res.status(201).json(user.username);
//         });
//     })
//     .catch((err) => {
//       res.status(500).json(err);
//     });
// });

server.post('/login', (req, res) => {
  const credentials = req.body;

  db('users')
    .where({ username: credentials.username })
    .first()
    .then(function(user) {
      if (user || bcrypt.compareSync(credentials.password, user.password)) {
        res.send('welcome');
      } else {
        return res.status(401).json({ error: 'Incorrect credentials' });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

const port = 5000;
server.listen(port, () => {
  console.log(`server on http://localhost:${port}`);
});
