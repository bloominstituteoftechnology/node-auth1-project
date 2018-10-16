const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = require('./data/dbConfig.js');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const server = express();

server.use(express.json());
server.use(cors());

const sessionConfig = {
    secret: 'nobody.tosses.a.dwarf.!',
    name: 'monkey', //defaults to connect.sid. we change it so ppl dont know were using express session
    httpOnly: true, //not accessible via JS
    resave: false,
    saveUninitialized: false,
    cookie: {
	secure: false, // true means over https only
	maxAge: 1000 * 60 * 1 // 1000 ms times 60 seconds times one equals one minute
    }
};

server.use(session(sessionConfig));

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
		req.session.username = user.username;
		res.status(200).json({welcome: user.username});
	    } else {
		res.status(401).json({message: 'You shall not pass!'});
	    }
	})
	.catch(err => {
	    res.status(500).json({err});
	});
});

server.get('/api/users', protected, (req, res) => {
    db('users')
	.select('id', 'username', 'password')
	.then(users => {
	    res.json(users);
	})
	.catch(err => {
	    res.status(401).send(err);
	});
});

function protected(req, res, next) {
    if(req.session && req.session.username) {
	next();
    } else {
	res.status(401).json({message: 'you are not authorized!'});
    }
}

const port = 3300;
server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

