const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);


const db = require('./db/db.js');

const server = express();

const sessionConfig = {
    name: 'dont call this session',
    secret: 'keep this a secret',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, 
        secure: false, 
    },
    httpOnly: true, 
    resave: false, 
    saveUninitalized: false, 
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db, 
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    }),
};
server.use(session(sessionConfig));

server.use(express.json());
server.use(cors());
server.use(helmet());

function protected(req, res, next) {
    if (req.session && req.session.username){
        next();
    } else {
        res.status(401).json({message: 'you are not authorized, please login'})
    }
}

server.get('/', (req, res) => {
    res.status(200).json({message: "server is running"})
})

server.post('/register/', (req,res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 3);
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(ids => {
            const id = ids[0];//cause it return a single array?
            res.status(201).json(id);
        }).catch(err => res.status(500).send(err))
})

server.post('/login/', (req,res) => {
    const creds = req.body;
    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)){

                req.session.username = user.username;//this is the first place that the session is created? 

                res.status(200).send(`welcome ${res.session.username}!`);
            } else {
                res.status(401).json({message: "not authorized"})
            }
            // const id = ids[0];//cause it return a single array?
        }).catch(err => res.status(500).send(err))
})

server.get('/logout/', (req,res) => {
    if (req.session) {
        req.session.destroy(err => {
           if (err){
            res.send('err logging out')
           } else {
            res.send('you are now logged out')
        }
        })
    } 
})

server.get('/users/', protected, (req, res) => {
        db('users')
        .then(users => {
            res.status(201).json(users);
        }).catch(err => res.status(500).send(err))

})

server.get('/cookie', (req, res) => {
    res.status(200).send(req.session.username)
})

server.listen(4500, () => {console.log('\n === server running on 4500 === \n')})