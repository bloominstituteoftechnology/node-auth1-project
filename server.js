const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const dbConfig = require('./knexfile.js');
const db = knex(dbConfig.development);



const server = express();
server.use(morgan('combined'));
server.use(helmet());
server.use(express.json());


//
server.get('/', (req, res) =>{
    res.sendFile(__dirname + '/IMG_2732.JPG')
});

server.get('/api/users', async (req, res) => {
    try {
        const response = await db('users').select('id', 'username', 'password');
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json({ message: "Cannot get users"});
    }
})
// register
server.post('/api/register', (req, res) => {
    // grab credentials
    const creds = req.body;

    // hash the password
    const hash = bcrypt.hashSync(creds.password, 11)

    // replace user password with the hash
    creds.password = hash;
    // save the user
    db('users').insert(creds).then(ids => {
        const id =ids[0];
        res.status(201).json(id);
    }).catch(err => res.status(500).send(err))

    // return 201
})

// login
server.post('/api/login', (req, res) => {
    // grab the creds
    const creds = req.body;


    //find the user
    db('users').where({ username: creds.username }).first().then( user => {
        if( user && bcrypt.compareSync(creds.password, user.password)) {
            res.status(200).send('welcome');
        } else {
            res.status(401).json({ message: " You are not authorized to to see this page" });
        }
    }).catch(err => res.send(err));
    // check creds
})

// server running code
const PORT = 3300;
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})