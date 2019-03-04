const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs')

const db = require('./helpers/users-model');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.post("/api/login", (req, res) => {
    const creds = req.body;
  
    db("users")
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          res.status(200).json({ message: "Logged in" });
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(err => {
          res.status(500).json({
            error: "Error logging user into the database."
          });
        });
  });
  
  server.post("/api/register", (req, res) => {
    const creds = req.body;
  
    const hash = bcrypt.hashSync(creds.password, 8);
  
    creds.password = hash;
  
    db("users")
      .insert(creds)
      .then(ids => {
        res.status(201).json(ids);
      })
      .catch(err => {
        res.status(500).json({
          error: "Error registering user to the database."
        });
      });
  });

  function restricted (req, res, next) {
    // we'll read the username and password from headers
    // when testing the endpoint add these headers in Postman
    const { username, password } = req.headers
  
    if ( username && password ) {
      db('users').findBy({ username })
      .first()
      .then(user => {
        //here user is the object being passed in which is why you use user dot password to check it.
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "Invalid Creds"})
        }
      })
      .catch(error => {
        res.status(500).json(error)
      })
    } else {
      res.status(400).json({ messages: "No Creds Provided"})
    }
  }

server.get("/api/users", restricted, (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "User information could not be retrieved." })
    );
});

server.listen(5000, () => console.log('\nrunning on port 5000\n'));