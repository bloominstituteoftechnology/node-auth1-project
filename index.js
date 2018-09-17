const express = require('express');
const helmet = require('helmet');
const knex = require('knex')
const server = express();
const dbConfig = require('./db/knexfile')
const bcrypt = require('bcryptjs');

const db = knex(dbConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here

server.get('/', (req, res) => {
    res.send('Api Online')
})

server.get('/api/user', (req, res) => {
    db('auth')
    .select('id', 'username', 'password')
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => res.status(500).json(err))
})

// find the user in the database by it's username then
// if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
//   return res.status(401).json({ error: 'Incorrect credentials' });
// }

// the user is valid, continue on

server.post('/api/login', (req, res) => {
    const credentials = req.body;

    db('auth')
        .where({ username: credentials.username })
        .first()
        .then(user /* is an object */ => {
            console.log('user:', user);
            if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
              return res.status(401).json({ error: 'You shall not pass!' });
            }
            else {
                return res.status(200).json({ msg: 'Logged in' });
            }
        })
        .catch(error => {
            console.log('/api/login POST Error:', error)
            res.status(500).send('Please try again later')
        })
})

server.post('/api/register', (req, res) => {
    // grab credentials
    const creds = req.body
    // hash the password
    const hash = bcrypt.hashSync(creds.password, 5)
    //replace user password with hash
    creds.password = hash;
    // save the user
    db('auth').insert(creds).then(ids => {
        // const id = ids[0]
        // return 201
        res.status(201).json(ids)
    })
        .catch(err => {
            console.log('post error', err)
            res.status(500).json(err)
        })

})

server.put('/api/user/:id', (req, res) => {
    const { id } = req.params

    db('auth')
        .where({ id }).update(req.body)
        .then(count => {
            res.status(200).json(count)
        })
        .catch(err => res.status(500).json(err))
})

server.delete('/api/user/id', (req, res) => {
    const { id } = req.params;
    db("auth")
        .where({ id })
        .del()
        .then(count => {
            res.status(200).json(count);
        })
        .catch(err => {
            res.status(500).json(err);
        });
})


// server

const port = 3500;
server.listen(port, function () {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
