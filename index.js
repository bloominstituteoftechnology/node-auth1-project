const express = require('express');
const cors = require('cors');
const db = require('./database/dbConfig');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const server = express();
const KnexSessionStore = require('connect-session-knex')(session);
const sessionConfig = {
    name: 'monkey',
    secret: 'aduhjpafoshfoiogposjfpigjdiir',
    cookie: {
        maxAge: 1000 * 60 * 10,
        //1 second * 1 minute * 10 = 10 minutes
        secure: false
        //only set it over https; in production you want this to be true
    },
    httpOnly: true, //no js can touch it
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60 //(once per hour)
    })
}

server.use(session(sessionConfig)); //wires up session management
server.use(express.json());
server.use(cors());


server.get('/', (req, res) => {
    res.send('Server is alive!');
})


server.get('/api/users', (req, res) => {
    if(req.session && req.session.userId){
        //login is successfull
    db('users')
    .select('id', 'username', 'password')
    .then(users => {
        res.json(users);
    }) 
   .catch(err => res.send(err))
    } else {
        res.status(401).json({ message: 'you are not logged in!'})
    }
})

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 3);
    creds.password = hash;
    db('users')
    .insert(creds)
    .then(ids => {
        res.status(201).json(ids);
    })
    .catch(err => res.status(500).json(err));
})

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
    .where({ username: creds.username })
    .first()
    .then( user => {
        if (user && bcrypt.compareSync(creds.password, user.password)){
            req.session.userId = user.id;
            res.status(200).json({ message: "welcome user!"})
        } else {
            res.status(401).json({ message: 'invalid username or password' })
        }
    })
    .catch(err => res.json(err))
})

server.listen(3300, () => console.log('\nserver is running on port 3300\n'))