const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/dbConfig.js');
const session = require('express-session');
const server = express();

const PORT = 4200;

server.use(express.json());

server.use(session({
    name: 'sessionTest',
    secret: 'SECRET',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
}));

function protect(req, res, next){
    if (req.path.includes('/restricted/') || req.path == '/api/users') {
        if (req.session && req.session.userId) {
            next();
        } else {
            res.status(401).json({ message: 'go away' })
        }
        } else {
        next();
        }
};

server.use(protect);

server.get('/', (req, res) => {
    res.send('its alive!');
});

server.get('/api/users', (req, res) => {
    db('users')
    .select('id', 'username')
    .then(users => {
        res.json(users);
    })
    .catch(err => res.json(err));
});

server.post('/api/register', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user) {
            res.status(422).json({ message: 'A user with that username already exists' })
            } else {
            const hash = bcrypt.hashSync(creds.password, 12);
            creds.password = hash;
            db('users').insert(creds).then(id => {
                req.session.userId = id;
                res.status(201).json(id)
            }).catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));
})

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)){
            req.session.userId = user.id;
            res.status(200).json({ message: 'welcome to the thunderdome!' });
            } else {
        
            res.status(401).json({ message: 'you shall not pass'})
            }
        })
        .catch(err => res.json(err))
})

server.listen(PORT, () => {
    console.log(`live on port ${PORT}`);
});