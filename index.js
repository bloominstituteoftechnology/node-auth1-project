const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./data/dbConfig");
const server = express();
server.use(express.json());
server.use(cors());

server.post('/api/login', (req, res) => {
    // grab username and password from body
    const creds = req.body;
  
    db('users')
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          // passwords match and user exists by that username
          res.status(200).json({ message: 'Come on in!' });
        } else {
          // either username is invalid or password is wrong
          res.status(401).json({ message: 'invalid username or password' });
        }
      })
      .catch(err => res.json(err));
  });
server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 4);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.send(err);
    });
});
server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});
server.get('/', (req, res) => {
    res.send('Its Alive!');
  });
server.listen(3300, () => console.log("alive at 3300"));
