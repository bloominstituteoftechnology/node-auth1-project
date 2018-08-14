const express = require('express');
const bcrypt = require('bcryptjs')

const db = require('./data/db');
const session = require('express-session');
const server = express();

server.use(

    session({
        name: 'notsession',
        secret: 'nobody tosses a dwarf',
        cookie: {maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: true},
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
    req.session.name = 'Frodo';
    res.send('got it');
})

server.get('/getname', (req, res) => {
    const name = req.session.name;
    res.send(`hello ${req.session.name}`)
})


server.get('/users', (req, res) => {
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