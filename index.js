const express = require('express');
const cors = require('cors');

// Database

const server = express();

server.use(express.json());
server.use(cors());

// Make sure server is active
server.get('/', (req, res) => {
	res.send("It's alive!!!");
});

// Register endpoint
server.post('/api/register', (req, res) => {
	const creds = req.body;
});

// Login endpoint

// Users endpoint

// Server Listening
const port = 9000;
server.listen(port, () => console.log(`\nAPI running on port ${port}\n`));
