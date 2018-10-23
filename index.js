const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();

//middleware
const sessionConfig = {
	secret: 'noBody$tosses.a%dwarf!', 
	name: 'monkey', // defaults to connect.sid (sessionId)
	httpOnly: true, // JS can't access this
	resave: false,
	saveUninitialized: false, // laws!
	cookie: {
		secure: false, // over httpS
		maxAge: 1000 * 60 * 1,
	},
};
server.use(session(sessionConfig)); // use it as a middleWare

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
	res.send('It is working!');
});

server.post('/register', (req, res) => {
	const creds = req.body;
	const hash = bcrypt.hashSync(creds.password, 14);
	creds.password = hash;
	
	db('users')
		.insert(creds)
		.then(ids => {
			const id = ids[0];
			res.status(201).json({ newUserId: id });
		})
		.catch(err => {
			res.status(500).json(err);
		})
});

server.post('/login', (req, res) => {
	const creds = req.body;

	db('users')
		.where({ username: creds.username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				req.session.username = user.username;
				res.status(200).json({ welcome: user.username });
			} else {
				res.status(401).json({ message: 'you shall not pass' });
			}
		})
		.catch(err => res.status(500).json({ err }));
});

server.get('/users', protected, (req, res) => {
    console.log(req.session);
	if (req.session && req.session.username) {
		db('users')
		.select('id','username', 'password')
		.then(users => {
			res.json(users);
		})
		.catch(err => res.send(err));
	} else {
		res.status(401).send('not authorized');
	}
});

function protected(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized' })
    }
  }
  
  server.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send(err)
        } else {
          res.send('See ya!!')
        }
      })
    }
  })
  


const port = 5000;
server.listen(port, function() {
  console.log(`\n=== API listening on port ${port} ===\n`);
});