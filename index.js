const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const cors = require('cors');

// create db
const db = knex(knexConfig.development);

const sessionConfig = {
    name: 'Wzpurqlit',
    secret: 'Brandon is on fire!',
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false // want this true in production so it only sends a cookie over https
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db, 
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    })
};

// create server and define usages
const server = express();
server.use(express.json());
server.use(session(sessionConfig));
server.use(cors());


// root endpoint
server.get('/', async (req, res) => {
    res.status(200).json({ message: 'Server is up'});
});

// custom middleware
function protect(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: '*Door slams shut*'});
    }
}

// API endpoints
server.post('/api/register', async (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 4); // using pwr of 4 for testing speed
    creds.password = hash;
    try {
        const returned = await db('users').insert(creds);
        res.status(200).json(returned);
    } catch(err) {
        res.status(500).json(err);
    }
});


server.post('/api/login', async (req, res) => {
    // get {username and password} from req.body
    const creds = req.body;
    try {
        // look in db for user with that username and pw
        const user = await db('users').where({ username: creds.username }).first() // .first() bc db returns an array of 1 user object
        // if user exists, create session
        if (user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.userId = user.id;
            console.log('user.id', user.id);
            console.log('req.session.id', req.session.id);
            res.status(200).json({ message: 'Raise the gate!'});
            // create cookie and return it?
        } else {
            res.status(401).json({ message: 'Incorrect login. Lower the gate!'})
        }
    } catch(err) {
        res.status(500).json(err);
    }

});

server.get('/api/users', protect, async (req, res) => {
    try {
        const users = await db('users').select('id', 'username', 'password');
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err);
    }
});

const port = 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));