//bring in your dependencies
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const morgan = require('morgan')
const db = require('./database/dbConfig')

//set up server with dependencies
const server = express();
server.use(express.json());
server.use(cors());
server.use(morgan());
server.use(helmet());

//make sure it works check
server.get('/', (req, res) => {
    console.log('testing to see if this works')
    res.send({ message: 'do not forget to add the correct url info' })
})


//endpoints

//testing
//register new users
server.post('/api/register', (req, res) => {
    // grab username and password from body
    const creds = req.body;
    // generate the hash from the user's password
    const hash = bcrypt.hashSync(creds.password, 8);
    // override the user.password with the hash
    creds.password = hash;
    // save the user to the database
    db('users')
        .insert(creds)
        .then(id => res.status(201).json(id))
        .catch(err => res.status(500).json(err))
})

//login 
server.post('/api/login', (req, res) => {
    // grab username and password from body
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                //passwords match and has correct username too
                res.status(200).json({ message: 'Welcome to Asgard mortal' })
            } else {
                //they don't match
                res.status(401).json({ message: 'YOU SHALL NOT PASS!' })
            }
        })
        .catch(err => res.status(500).json(error))
})


//List of users
server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.json(err));
})


//port
server.listen(9000, () => {
    console.log('\nrunning on port 9000\n');
})
