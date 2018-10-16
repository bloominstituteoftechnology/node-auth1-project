const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());
server.use(
  session({
    name: 'blergh',
    secret: 'high fiving a million angels',
    cookie: {
      maxAge: 1*24*60*60*1000,
      secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: true
  })
);

server.use(express.json());
server.use(cors());
server.use(morgan('combined'));

const port = 8000;

//GET user information

server.get('/setname', (req, res)=> {
  req.session.name = 'nerds';
  res.send('blorch');
});

server.get('/getname', (req, res)=> {
  const name = req.session.name;
  res.send(`hello ${req.session.name}`);
});

server.get('/users', (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send({error: "A problem occurred, unable to retrieve users"}));
  });

  server.get('/users/:id', (req, res)=> {
      const {id} = req.params;
      db('users')
        .where({id})
        .then(user=> {
            if (!user) {
                res.status(404).json({message: "This user does not exist"});
            }
            res.status(200).json(user);
        })
        .catch(err=> {
            res.status(500).json({message: "A problem occurred, unable to retrieve this user"});
        })
  });

//REGISTER user
server.post('/register', (req, res)=> {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids=> {
      const id = ids[0];
      if (!credentials.username || !credentials.password) {
          res.status(400).json({message: "Please create a username and a password"});
      }
      res.status(201).json({newUserId: id});
    })
    .catch(err=> {
      res.status(500).json({error: "A problem occurred, unable to register this user"});
    })
});

//LOGIN user
server.post('/login', (req, res)=> {
    const loginCreds = req.body;
    db('users')
      .where({username: loginCreds.username})
      .first()
      .then(user=> {
        if (user && bcrypt.compareSync(loginCreds.password, user.password)) {
          res.status(200).json(`Welcome, ${user.username}!`);
        } else {
          res.status(401).json({message: "The username and/or password is incorrect"});
        }
      })
      .catch(err=> {
        res.status(500).json({error: "A problem occurred, unable to login"});
      });
});

//
server.get('/logout', (req, res)=> {
  if (req.session) {
    req.session.destroy(err=> {
      if (err) {
        res.json({error: "An error occurred while attempting to log out"});
      } else {
        res.json('Goodbye!');
      }
    });
  }
});

server.listen(port, ()=> console.log(`API running on port ${port}`));