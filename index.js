const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const session = require('express-session');

const db = require('./database/dbConfig.js')

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Server is running')
});


server.listen(9000, () => console.log('\nRunning on port 9000'));