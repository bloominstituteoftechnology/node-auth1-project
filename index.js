const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();
const parser = express.json();

server.use(parser);
server.use(helmet());

const PORT = 3000;

//ENDPOINTS

//Save user to database
server.post('/api/register', (req, res) => {
    const user = req.body;

    if (user.username && user.password) {
        const hash = bcrypt.hashSync(user.password);
        user.password = hash;


    } else {
        res.status(400).json({
            message: 'A username and password are required.'
        });
    }
});

//Login as user
server.post('api/login', (req, res) => {
    const user = req.body;
    

})



server.listen(PORT, () => {
    console.log(`\n API Listening on http://localhost:${PORT}\n`);
});