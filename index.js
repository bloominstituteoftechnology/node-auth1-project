const express = require('express');
const cors = require('cors');


// const db = require('./data/dbConfig.js');

const authRoutes = require('./authHelpers/authRoutes.js');

const server = express();


server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Its Alive!');
});

server.use('/api/restricted', authRoutes);

const port = 3300;

server.listen(port, () => {
    console.log(`\nAPI running on port ${port}\n`)
});