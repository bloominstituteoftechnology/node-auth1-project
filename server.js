const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./data/db');

const server = express();

//middleWare
function protected(req, res, next) {
    if (req.session && req.session === '3rd-UserName') {
        next();
    } else {
        return res.status(401).json({ error: 'Incorrect credentials' })
    }
}

// configure express-session middleware
server.use(
    session({
        name: 'notsession', // default is connect.sid
        secret: 'nobody tosses a dwarf!',
        cookie: { 
            maxAge: 1 * 24 * 60 * 60 * 1000,// 1 day in milliseconds
            secure: false, // only set cookies over https. Server will not send back a cookie over http.
        }, 
        httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
        resave: false,
        saveUninitialized: true,
    })
);

server.use(express.json());


const port = 3333;


//HOME
server.get('/', (req, res) => {
    res.send('Rock-n-Roll!!');
});

server.get('/users', (req, res) => {
    if (req.session && req.session.username === '3rd-UserName') {
        db('users')
            .then(users => {
                res.json(users)
        })
        .catch(err => res.send(err));
    } else {
        return res.status(401).json({ error: 'Incorrect credentials' })
    }
});

server.post('/register', (req, res) => {
    const { username, password } = req.body;
    const newUser = {username, password};
    // hash password
    const hash = bcrypt.hashSync(newUser.password, 14);
    newUser.password = hash;   

    db('users')
        .insert(newUser)
        .then(response => {
            //session
            req.session.user = newUser.username; 
            res.status(201).json({ id: `${response}` });
        })
        .catch(function (error) {
            res.status(500).json({ error })
    })
})

server.post('/login', (req, res) => {
    const credentials = req.body;
    db('users')
        .where({ username: credentials.username })
        .first()
        .then(function(user) {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                //session
                req.session.user = user.username; 
                res.status(200).json(`${user.username}, may enter!`)
            } else {
                return res.status(401).json({error: 'Incorrect credentials'})
            }
        })
        .catch(function (error) {
            res.status(500).json({ error })
    })
})

//middleWare
server.get('/private', protected, (req, res) => {
    res.send('<h1>PRIVATE AREA</h1>');
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error logging out');
            } else {
                res.send('logged out.');
            }
        });
    }
});



server.listen(port, () =>
    console.log(`Rock-n-Roll @port: ${port}`)
);