const express = require('express');
const bcrypt = require('bcryptjs');
const KnesSessionStore = require('connect-session-knex')(session);
const helmet = require('helmet');
const knex = require('knex');
const cors = require('cors');
const session = require('express-session');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express()

server.use(express.json())
server.use(session({
    name: 'monkey',
    secret: 'abcdefg - At Least I Have Chicken - Leroy Jenkins',
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized:false,
    store: new KnesSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
}));

function protected(req, res, next){
    if (req.session && req.session.userId){
        next()
    } else {res.status(401).json({ message: "You Shall Not Pass!!!!!!!!" })}
}

server.use(helmet());
server.use(cors());

server.get('/', (req, res) => {
    res.json({ message: 'API Running!' });
});

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    db('users').insert(credentials)
    .then(user => {res.status(201).json(user)})
    .catch(error => res.status(500).json({ message: "You done F'd Up", error }))
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err){
                res.send('you can never leave!')
            } else {
                res.send('bye')
            }
        });
    } else { res.end() }
});

server.post('/api/login', (req, res) => {
    const logger = req.body

    db('users')
    .where({ username: logger.username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(logger.password, user.password)){
            req.session.userId = user.id;

            res.status(200).json({ message: `Logged In: Welcome ${user.username}!` })
        } else {res.status(401).json({ message: 'You Shall Not Pass!' })}
    }).catch(error => res.status(500).json({ message: 'error', error }));
    
    // db('users').insert(logger)
    // .then(user => res.status(201).json(user))
    // .catch(error => res.status(500).json({ message: "You done F'd Up", error }))
});

server.get('/api/users', protected, (req, res) => {
    if (req.session && req.session.userId) {
    db('users')
        .select('username', 'id', 'password')
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json({ message: 'Could Not Retrieve Users', error }));

});





server.listen(7777, () => console.log('\n === API Running On Port 7777 => http://localhost:7777 ===\n'))