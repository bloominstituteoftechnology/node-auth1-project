const express = require('express')
const helmet = require('helmet')
const cors = require('cors');
const bcrypt = require('bcryptjs')
const knex = require('knex')
const knexConfig = require('./knexfile.js')
const session = require('express-session')
const port = 9000
const db = knex(knexConfig.development)
const server = express()

server.use(express.json())
server.use(helmet())
server.use(cors())
server.use(session({
    name: 'panda', // default is connect.sid
    secret: 'bamboo rules',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);

server.route('/api/setname')
  .get((req, res) => {
    req.session.username = 'Kitty';
    res.send(`Set username to ${req.session.username}`);
  })

server.route('/api/getname')
  .get((req, res) => {
    res.send(`Hey ${req.session.username}, good to see you!`);
  })

server.route('/api/register')
  .post((req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    db('users')
      .insert(credentials)
      .then(ids => {
        const id = ids[0]
        res.status(201).json({ newUserId: id });
      })
      .catch(err => res.status(500).json(err));
  })

server.route('/api/login')
  .post((req, res) => {
    const credentials = req.body
    db('users')
      .where({ username: credentials.username }).first()
      .then(user => {
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          req.session.username = user.username
          return res.status(200).json({ message: `Welcome ${user.username}!` })
        }
        return res.status(401).json({ message: 'You shall not pass!' });
      })
      .catch(err => res.status(500).json({ err }));
  });

server.route('/api/logout')
  .get((req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('good bye');
        }
      })
    }
  })

server.route('/api/users')
  .get(protected, (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => res.json(users))
      .catch(err => res.send(err));
  });

function protected(req, res, next) {
  if (req.session && req.session.username) return next();
  return res.status(401).json({ message: 'you shall not pass!!' });
}

server.listen(port, () => console.log(`\n===Listening on ${port}===\n`))
