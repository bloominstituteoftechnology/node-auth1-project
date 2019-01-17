const express = require('express');

const server = express();

server.use(express.json());
const PORT = 5000;

server.get('/', (req, res) => {
    res.send('API is Active');
});

server.listen(PORT, () => console.log(`\nServer running on port ${PORT}\n`));