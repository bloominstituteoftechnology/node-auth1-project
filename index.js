const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

server.use(express.json());
server.use(cors());
server.use(helmet());

// log all API request types and their endpoint
function logger(req, res, next){
    console.log(`${req.method} to ${req.url}`);
    next();
}
server.use(logger);

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
        res.status(500).json({errorMessage: `There was an error.\n`, error: err})
    })
})

server.post('/login', (req, res) => {
    const creds = req.body;

    db('users').where({username: creds.username}).first().then(user => {
        // use bcrypt compareSync to compare the de-hashed passwords
        if(user && bcrypt.compareSync(creds.password, user.password)){
            // if user found
            res.status(200).json({message: `Welcome, ${creds.username}!`})
          } else {
            res.status(401).json({message: 'You! Shall not! Pass!'})
          }
    })
})

const port = 9000;

server.listen(port, function() {
    console.log(`\n === WEB API LISTENING ON ${port} === \n`)
})