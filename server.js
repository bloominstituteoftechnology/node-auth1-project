// DEPENDENCIES
const express = require('express');
const bcrypt = require('bcryptjs');
const model = require('./data/helpers/model.js');

// SERVER
const server = express();

// MIDDLEWARE
const configureMiddleware = require('./middleware/middleware');
configureMiddleware(server);

// ENDPOINTS
// create user
server.post('/api/register', (req, res) => {
	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 12);
	credentials.password = hash;

	model
		.addUser(credentials)
		.then(id => {
			res.status(201).json({ newUserId: id });
		})
		.catch(err => {
			if (err.code === 'SQLITE_CONSTRAINT') {
				return res.status(409).json({ error: 'Duplicate username' });
			} else {
				return res.status(500).json(err);
			}
		});
});

server.post('/api/login', (req, res) => {
	const credentials = req.body;

	model
		.login(credentials)
		.then(id => {
			if (id) {
				res
					.status(200)
					.json({ success: `User ${credentials.name} logged in`, cookie: id });
			} else {
				res.status(401).json({ error: `invalid username or password` });
			}
		})
		.catch(err => res.status(500).json(err));
});

// PORT
const port = 5000;
server.listen(port, () => {
	console.log(`\n=== Listening on http://localhost:${port} ===\n`);
});
