const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
const server = express();

const sessionConfig = {
    secret: 'i.want-%a$new.bronzer$',
    name: 'beauty-bakerie',
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 15
    }
};


server.use(session(sessionConfig));
server.use(express.json());
server.use(helmet());

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db('users').insert(credentials).then(ids => {
        const id = ids[0];
        res.status(201).json({newUser:id})
    })
    .catch(err => {
        res.status(500).send(err.message)
    })
})

server.get('/api/users', (req, res) => {
    if(req.session && req.session.username) {
    db('users')
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).send(err.message)
    })
    }else{
        res.status(401).json({message:"Please login to access users"})
    }
})


server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users').where({user_id:creds.username}).first()
    .then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)){
            res.status(201).send({message: "Welcome " + user.user_id})
        }else{
            res.status(401).send({message: "UserId or password incorrect"})
        }
    })
    .catch(err => {
        res.status(500).send(err.message)
    })
})







const port = 7000;
server.listen(port, () => {
    console.log(`Server started on port ${port}!`)
})