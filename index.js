const express = require('express');
const helmet = require('helmet');
// const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');
const Users = require('./userHelper/userHelpers');

const server = express();

const auth = (req, res, next) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
				return next();
			} else {
				res.status(401).json('invalid creds');
			}
		})
		.catch(err => res.status(500).json('server error'));
};

server.use(helmet());
server.use(express.json());
// server.use(cors());

server.get('/', (req, res) => {
	res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
	let user = req.body;

	const hash = bcrypt.hashSync(user.password, 10);
	user.password = hash;

	Users.add(user)
		.then(newUser => {
			res.status(201).json(newUser);
		})
		.catch(err => res.status(500).json(err));
});

server.post('/api/login', auth, (req, res) => {
	let user = req.body;

	Users.find(user)
		.then(authenticatedUser => {
			res.status(201).json(authenticatedUser);
		})
		.catch(err => res.json(err));
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
