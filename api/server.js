const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const knexConfig = require('../knexfile.js');

const server = express();

const db = knex(knexConfig.development);

server.use(helmet());
server.use(express.json());


server.post('/register', (req, res) => {
      const userInfo = req.body;
    
      const hash = bcrypt.hashSync(userInfo.password, 12);

      userInfo.password = hash;
    
      db('users')
        .insert(userInfo)
        .then(ids => {
            res.status(201).json(ids)
      }).catch(err => res.status(500).json(err))
});

server.get('/users', async (req, res) => {
      const users = await db('users');

      res.status(200).json(users);
});  

server.post('/login', (req, res) => {
      const creds = req.body;

      db('user')
        .where({ username: creds.username })
        .first()
        .then(user => {
             if (user && bcrypt.compareSync(creds.password, user.password)) {
                  res.status(200).json({ message: `welcome ${user.name}`})
             } else {
                  res.status(401).json({ you: 'shall not pass!!'});
             }
        }).catch(err => res.status(500).json({ you: 'what is happening!!'}))

});




module.exports = server;