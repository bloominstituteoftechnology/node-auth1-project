const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

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
    },
    store: new KnexSessionStore({
        tablename: 'session',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(helmet());

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db('users').insert(credentials)
    .then(ids => {
        const id = ids[0];
        req.session.username = credentials.user_id
        console.log(req.session)
        res.status(201).json({newUser:id})
    })
    .catch(err => {
        res.status(500).send(err.message)
    })
})

server.get('/api/users', protected, (req, res) => {
    console.log(req.session)
    db('users')
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).send(err.message)
    })
})


server.post('/api/login', (req, res) => {
    const creds = req.body;
    req.session.username = creds.user_id
    db('users')
    .select('*')
    .where({"user_id":creds.user_id}).first()
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

server.get('/api/logout', (req, res) => {
    if(req.session){
        console.log(req.session)
        req.session.destroy();
        res.send("You have been logged out")
    }
})


function protected(req, res, next) {
    //console.log(req.session);
    if (req.session && req.session.username){
        console.log(req.session)
        next();
    }else{
        res.status(401).json({message: 'Please login to access users'}); 
    } 
}





const port = 7000;
server.listen(port, () => {
    console.log(`Server started on port ${port}!`)
})