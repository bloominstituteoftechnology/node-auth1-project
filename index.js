const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const session = require('express-session')

const db = require('./database/dbConfig');

const server = express();

server.use(express.json());
server.use(cors());
server.use(session({
    // configure express-session middleware
      name: 'notsession', // default is connect.sid
      secret: 'nobody expects the Spanish inquisition!',
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
      }, // 1 day in milliseconds
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      resave: false,
      saveUninitialized: false,
  }))
  

server.get('/', (req, res) => {
    res.send(`I'm alive!`)
});

server.get('/api/users', (req, res) => {
    if(req.session && req.session.userId){
        db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users)
        })
        .catch(err => res.send(`You shall not pass!`))
    } else {
        res.status(400).send(`access denied`)
    }
})

server.post('/api/register', (req, res) => {
    const user = req.body;
    console.log(`Tommy's session in the register post req:`, req.session)
    user.password = bcrypt.hashSync(user.password, 14)
    db('users').insert(user)
    .then(ids => {
        res.status(201).json({id: ids[0]})
    })
    .catch(error => {
        res.status(500).send(`You shall not pass!`)
    })
})

server.post('/api/login', (req, res) => {
    const userBody = req.body;
    db('users').where('username', userBody.username)
    .then(users => {
        if(users.length && bcrypt.compareSync(userBody.password, users[0].password)){
            req.session.userId = users[0].id
            res.json(`Correct`)
        } else {
            res.status(404).json(`You shall not pass!`)
        }
    })
    .catch(err => {res.status(500).send(err)})
})

server.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            res.status(500).send(`failed to log you out`)
        } else {
            res.status(201).send('successfully logged you out')
        }
    })

})

server.listen(2525, () => console.log(`I'm alive!`))