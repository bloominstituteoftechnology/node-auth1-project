const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
//const db = knex(knexConfig.development);
const db = require('./data/dbConfig.js');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const server = express();

server.use(express.json());
server.use(cors());

// endpoints here
server.get('/', (req, res) => {
    res.send("It's Alive");
});

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    db('users')
	.insert(credentials)
	.then(ids => {
	    const id = ids[0];
	    res.status(201).json({newUserId: id});
	})
	.catch(err => {
	    res.status(500).json(err);
	});
});

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
	.where({ username: creds.username})
	.first()
	.then(user => {
	    if (user && bcrypt.compareSync(creds.password, user.password)) {
		res.status(200).json({welcome: user.username});
	    } else {
		res.status(401).json({message: 'wrong password'});
	    }
	})
	.catch(err => {
	    res.status(500).json({err});
	});
});

server.get('/api/users', (req, res) => {
    db('users')
	.then(users => {
	    res.status(200).json(users);
	})
	.catch(err => {
	    res.status(404).json(err);
	});
});

const port = 3300;
server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

