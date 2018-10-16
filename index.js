const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./data/dbConfig.js');

server.use(express.json());
server.use(cors());
server.use(helmet());

const sessionConfig = {
    name: 'desertkid',
    secret: 'now-this@is;podracing!',
    cookie: {
    maxAge: 1000 * 60 * 1, // one minute
    secure: false // change to true for https in production
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
    }

server.use(session(sessionConfig));



// log all API request types and their endpoint
function logger(req, res, next){
    console.log(`${req.method} to ${req.url}`);
    console.log(`${req.session}`)
    next();
}
server.use(logger);

function confidential(req, res, next){
    if(req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({error: `You shall not pass!`})
    }
}

// test if server is running
server.get('/', (req, res) => {
    res.send('It works yo');
})

server.post('/register', (req, res) => {
    // store the passed information from the client
    const credentials = req.body;
    // asynchronously hash the password 2^14 times
    const hash = bcrypt.hashSync(credentials.password, 14);
    // assign the newly hashed password to be passed to the database
    credentials.password = hash;
    // send the data to the database
    db('users').insert(credentials).then(ids => {
        // return the associated user ID
        const id = ids[0];
        res.status(201).json({newUserId: id})
    })
    .catch(err => {
        console.log(err);
        // inform client if username is taken
        if(err.errno === 19){
            res.status(409).json({error: `There is already an existing user with that username. Please try another username.`})
        }
        res.status(500).json({errorMessage: `There was an error.\n`, error: err})
    })
})

server.post('/login', (req, res) => {
    const creds = req.body;

    db('users').where({username: creds.username}).first().then(user => {
        // use bcrypt compareSync to compare the de-hashed passwords
        if(user && bcrypt.compareSync(creds.password, user.password)){
            // if user found, add username to session
            req.session.username = user.username;
            console.log(req.session.username);
            
            res.status(200).json({message: `Welcome, ${creds.username}!`})
          } else {
            res.status(401).json({message: 'You! Shall not! Pass!'})
          }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: `Something went wrong.`, errMsg: err})
    })
})

server.get('/users', confidential, (req, res) => {
    if(req.session && req.session.username){
    db('users').select('id', 'username', 'password').then(users => {
        res.json(users);
    })
    .catch(err => {
        console.log(err);
        res.json({error: err});
    })
} else {
    res.status(401).send('not authorized');
}
})


server.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err){
                res.send('error logging out');
            } else {
                res.send('good bye!')
            }
        })
    }
})

const port = 9000;

server.listen(port, function() {
    console.log(`\n === WEB API LISTENING ON ${port} === \n`)
})