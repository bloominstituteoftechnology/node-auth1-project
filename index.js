const express = require('express');
const cors = require('cors');

const db = require('./dbAccess');

const server = express();

server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash
})

server.listen(9000, () => console.log('\n== API on port 9k ==\n'));