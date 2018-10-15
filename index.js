const express = require('express');
const applyGlobalMiddleware = require('./config/middleware/global.js');

const server = express();
const port = 5000;

applyGlobalMiddleware(server);

server.get('/', (req, res) => {
	res.status(200).json('Server is working.');
});

server.listen(port, () => { console.log(`\n=== Listening on port ${ port } ===`) });
