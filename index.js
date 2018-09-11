const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const session = require("express-session")
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./db/dbConfig.js');

const server = express();

const sessionConfig = {
    name: "banana",
    secret: "i've got a bad feeling about this",
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
      }),
};

server.use(session(sessionConfig));

server.use(express.json());
server.use(cors());
server.use(helmet());

function protected(req, res, next) {
    console.log(req.session)
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized User, please log in.' });
    }
}

server.get('/', (req, res) => {
    res.send("API is running...")
});

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(ids => {
            const id = ids[0];
            res.status(201).json(id);
        })
        .catch(err => res.status(500).send(err))
});

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username;
                res.status(200).send("Login Successful");
            } else {
                res.status(401).json({ message: 'Unauthorized login attempt. Username or Password are incorrect.'})
            }
        })
        .catch(err => res.status(500).send(err));
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('good bye');
        }
      });
    }
  });

  server.get('/api/users', protected, (req, res) => {
    console.log(req.session)
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

server.listen(6000, () => console.log('\n Running on port 6000 \n'))