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
			res.status(500).json(err);
		});
});

// PORT
const port = 5000;
server.listen(port, () => {
	console.log(`\n=== Listening on http://localhost:${port} ===\n`);
});
