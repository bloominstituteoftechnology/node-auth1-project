const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');
const knexSessionStore = require('connect-session-knex')(session);

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
    },
    store: new knexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    })

}

server.use(session(sessionConfig));

server.use(express.json());
server.use(cors())

server.get('/', (req, res) => {
    res.send('Server is running')
});

function protected(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).send('Not AUthorized')
    }
}


server.get('/api/users', protected, (req, res) => {
    db('users')
        .select('id', 'username','password') // password on this line just to see if the password hash
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => res.send(err))
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
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.userId = user.id
            res.status(200).json({Hello: user.username})
        } else {
            res.status(401).json({message: 'You shall not pass!'})
        }
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if(err) {
                res.send('LoL, still not logout yet')
            } else {
                res.send('Your are logout')
            }
        })
    } else {
        res.end();
    }
});

server.listen(9000, () => console.log('\nRunning on port 9000'));