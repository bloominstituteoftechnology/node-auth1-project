const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const knex = require('knex');

const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

const sessionConfig = require('./sessionConfig.js');

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

server.post('/api/login', (req,res) => {
    const cred = req.body;

    db('users')
        .where({username: cred.username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(cred.password, user.password)) {
                req.session.userId = user.id
                res.status(201).json({ message: 'login successful' });
            } else {
                res.status(401).json({ message: 'access denied' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'could not log you in', err });
        })
});

server.post('/api/register', (req, res) => {
    const cred = req.body;

    const hash = bcrypt.hashSync(cred.password, 12);

    cred.password = hash;

    db('users')
        .insert(cred)
        .then(ids => {
            res.status(201).json(ids)
        })
        .catch(err => {
            res.status(500).json({ message: 'could not register', err });
        });
});

server.get('/', (req, res) => {
    res.send('running');
  });
  
server.get('/api/users', (req, res) => {
    if (req.session && req.session.userId) {
        db('users')
        .select('id', 'username') // ****** added password earlier to see if it worked
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
    } else {
        res.status(401).json({ message: 'you shall not pass' })
    }
  });

  server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('you can never leave');
        } else {
          res.send('bye');
        }
      });
    } else {
      res.end();
    }
  });
  
  server.listen(8300, () => console.log('\nrunning on port 8300\n'));
