const express = require('express');
const helmet = require('helmet');
const knex = require('knex')
const server = express();
const dbConfig = require('./db/knexfile')
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = knex(dbConfig.development);


const sessionConfig = {
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
}

server.use(session(sessionConfig))
server.use(express.json());
server.use(helmet());

// endpoints here

server.get('/', (req, res) => {
    res.send('Api Online')
})



server.post('/api/register', (req, res) => {
    // grab credentials
    const creds = req.body
    // hash the password
    const hash = bcrypt.hashSync(creds.password, 5)
    //replace user password with hash
    creds.password = hash;
    // save the user
    db('auth').insert(creds).then(ids => {
        // const id = ids[0]
        // return 201
        res.status(201).json(ids)
    })
        .catch(err => {
            console.log('post error', err)
            res.status(500).json(err)
        })

})



server.post('/api/login', (req, res) => {
    const credentials = req.body;

    db('auth')
        .where({ username: credentials.username })
        .first()
        .then(user /* is an object */ => {
            console.log('user:', user);
            if (user || bcrypt.compareSync(credentials.password, user.password)) {
                req.session.username = user.username
                const name = req.session.username
                return res.status(200).json(`Welcome ${name}`);
            }
            else {
                return res.status(401).json({ error: 'You shall not pass!' });            }
        })
        .catch(error => {
            console.log('/api/login POST Error:', error)
            res.status(500).send('Please try again later')
        })
})

server.get('/api/greet', (req, res) => {
    const name = req.session.username;
    res.send(`hello ${name}`);
});

server.get('/api/user', (req, res) => {
    // only send the list of users if the client is logged in
    req.session && req.session.username ?

        db('auth')
            .select('id', 'username', 'password')
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => res.status(500).json(err))
        :
        res.status(401).json({ msg: 'Not authorized for this action' })
})



server.get('/api/admins', (req, res) => {
    //  if (req.session && req.session.userId) {
    //     let userId = req.session.userId
    // db('roles as r').join('user_roles as ur', 'ur.role_id', '=', 'r.id')
    //     .select('r.role_name')
    //     .where('ur.user_id', userId)
    //     .then(roles => {
    //         if (roles.includes('admin')) {
    //             // have access
    //         } else {
    //             // bounced
    //         }
            
            
    //     })
    // }

    // only send the list of users if the client is logged in
    req.session && req.session.role === 'admin' ?
        db('auth')
            .select('id', 'username', 'password')
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => res.status(500).json(err))
        :
        res.status(403).json({ msg: 'Not authorized for this action' })

})



server.put('/api/user/:id', (req, res) => {
    const { id } = req.params

    db('auth')
        .where({ id }).update(req.body)
        .then(count => {
            res.status(200).json(count)
        })
        .catch(err => res.status(500).json(err))
})



server.delete('/api/user/id', (req, res) => {
    const { id } = req.params;
    db("auth")
        .where({ id })
        .del()
        .then(count => {
            res.status(200).json(count);
        })
        .catch(err => {
            res.status(500).json(err);
        });
})


// server

const port = 3500;
server.listen(port, function () {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
