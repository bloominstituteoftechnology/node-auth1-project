// DEPENDENCIES
const express = require('express');

// SERVER
const server = express();

// MIDDLEWARE
const configureMiddleware = require('./middleware/middleware');

configureMiddleware(server);

// ENDPOINTS

// PORT
const port = 5000;
server.listen(port, () => {
	console.log(`\n=== Listening on http://localhost:${port} ===\n`);
});
