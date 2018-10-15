const express = require('express');
const cors = require('cors');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json(), cors());

server.get('/', (req, res) => {
    res.send('It lives!');
});

server.get('/api/users', (req, res) => {
    db
        ('users')
        .select('id',)
})