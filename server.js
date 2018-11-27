const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./database/dbConfig.js');

const server = express();

const sessionConfig = {
    name: 'lambda',
    secret: '0jhda978dfv78fdva67nbgv78ngf76a56',
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false,
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
    }),
}

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

function protected(req, res, next) {
    if(req.session && req.session.userId) {
        next();

    } else {
        res.status(401).json({message: 'you shall not pass!'})
    }

}



server.get('/api/me', protected, (req, res) => {
    if(req.session && req.session.userId) {
        // they are logged in, go ahead and provide access
        db('users')
        .where({ id: req.session.userId })
        .first()
            .select('id', 'username')
            .then(users => {
            res.json(users);
            })
            .catch(err => res.send(err));
    } else {
        // bounce them
        res.status(401).json({message: 'you shall not pass!'})
    }
   
  });

  
server.get('/api/users', protected, (req, res) => {
    if(req.session && req.session.userId) {
        // they are logged in, go ahead and provide access
        db('users')
            .select('id', 'username')
            .then(users => {
            res.json(users);
            })
            .catch(err => res.send(err));
    } else {
        // bounce them
        res.status(401).json({message: 'you shall not pass!'})
    }
   
  });

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
    .where({ username: creds.username })
    .first()
    .then(user =>{
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.userId = user.id
            res.status(200).json({message: 'welcome!'})
        } else {
            res.status(401).json({ message: 'you shall not pass!'})
        }

    }).catch()
    
})

server.get('/api/logout', (req, res) => {
    console.log(req.session)
    if(req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error')
            } else {
                res.send('logged out')
            }
        })
    }
})

server.post('/api/register', (req, res) => {
    // grab username and password from body
    const creds = req.body;
    // generate hash from the user's password
    const hash = bcrypt.hashSync(creds.password, 14); // rounds is 2^X
    // override the user.password with the hash
    creds.password = hash;
    // save the user to the database
    db('users').insert(creds)
    .then(ids => {
        res.status(201).json(ids);
    }).catch(err => {
        json(err)
    })
})


server.listen(3300, () => console.log('\nrunning on port 3300\n'));