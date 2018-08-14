const express = require('express');
const bcrypt = require('bcryptjs')

const db = require('./data/db');
const session = require('express-session');
const server = express();

function protected(req, res, next) {
    if (req.session && req.session.username === 'nucked') {
        next();
    } else {
        return res.status(401).json({error: 'Incorrect credentials'})
    }
}

server.use(

    session({
        name: 'itmenick',
        secret: 'i like mhw',
        cookie: {maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: false},
        httpOnly: true, 
        
        resave: false,
        saveUnitialized: true,
    })
);

server.use(express.json());
const PORT = 3300

server.get('/', (req, res) => {
    res.send('Active');
});

server.get('/setname', (req, res) => {
    req.session.username = 'nucked';
    res.send(`got it ${req.session.username}`);
})

server.get('/getname', (req, res) => {
    const name = req.session.username;
    res.send(`hello ${req.session.username}`)
})


server.get('/users', protected, (req, res) => {
db('users')
.then(response => {
    res.json(response);
})
.catch(err => res.send(err));
})


server.post('/register', function(req, res) {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    db('users')
    .insert(user)
    .then(function(ids) {
        db('users')
        .where({id: ids[0]})
        .first()
        .then(user => {
            res.send(`Welcome ${user.username}`)
        });
    })
    .catch(function(error) {
        res.status(500).json({ error });
    })
})

server.post('/login', function(req,res) {
    const credentials = req.body;

    db('users')
    .where({username: credentials.username})
    .first()
    .then(function(user) {
        if (user && bcrypt.compareSync(credentials.password, user.password) ) {
            res.send(`Welcome ${user.username}`);

        } else {
            return res.status(401).json({error: 'Incorrect credentials'});
        }
    })
    .catch(function(error) {
        res.status(500).json({error});
    })
})





server.listen(PORT, () => {
    console.log(`Server up and running on ${PORT}`)
})