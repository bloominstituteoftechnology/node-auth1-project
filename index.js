const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');

// create server
const server = express();
server.use(express.json());

// create db
const db = knex(knexConfig.development);

// root endpoint
server.get('/', async (req, res) => {
    res.status(200).json({ message: 'Server is up'});
});

// API endpoints
server.post('/api/register', async (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 4); // using pwr of 4 for testing speed
    creds.password = hash;
    try {
        const returned = await db('users').insert(creds);
        res.status(200).json(returned);
    } catch(err) {
        res.status(500).json(err);
    }
});

const port = 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));