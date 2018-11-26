const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const session = require('express-session');

const db = require('./database/dbConfig.js')

const server = express();

const sessionConfig = {
    secret: 'animal kindom',
    name: 'lambda_users',
    httpOnly: true,
    resave: false,
    savaUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000*60*1
    }
}

server.use(session(sessionConfig));

server.use(express.json());
server.use(cors())

server.get('/', (req, res) => {
    res.send('Server is running')
});


server.get('/api/users', (req, res) => {
    if(req.session && req.session.username) {
        db('users')
            .select('id', 'username', 'password') // password on this line just to see if the password hash
            .then(users => {
                res.status(200).json(users)
            })
            .catch(err => res.send(err))
    } else {
        res.status(401).send('Not Authorized')
    }
});

server.post('/api/register', (req, res) => {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 14)
    credentials.password = hash;

    db('users')
        .insert(credentials)
        .then(ids => {
            const id = ids[0];
            res.status(201).json({newUserId: id})
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users').where({username: creds.username}).first().then(user => {
        if(user && bcrypt.compareSync(creds.password, password)) {
            req.session.username = username
            res.status(200).json({Hello: user.username})
        } else {
            res.status(401).json({message: 'You shall not pass!'})
        }
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

server.listen(9000, () => console.log('\nRunning on port 9000'));