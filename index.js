const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);
const server = express();
server.use(helmet());
server.use(express.json());

const port = 8000;
server.listen(port, () => console.log(`API running on port ${port}`));

// checker endpoint
server.get('/', (request, response) => {
    response.send('Server initialized.');
});

// user endpoints
server.get('/api/users', (request, response) => {


    db('users')
        .then(users => {
            return response
                .status(200)
                .json(users);
        })
        .catch(() => {
            return response
                .status(500)
                .json({ Error: "Could not find list of users." })
        });
});

server.post('/api/register', (request, response) => {
    const credentials = request.body;

    const hashedPW = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hashedPW;

    db('users')
        .insert(credentials)
        .then(credentials => {
            return response
                .status(201)
                .json(credentials);
        })
        .catch(() => {
            return response
                .status(500)
                .json({ Error: "There was an error while saving the user" })
        });
});

server.post('/api/login', (request, response) => {
    const credentials = request.body;

    db('users')
        .where({ username: credentials.username })
        .first()
        .then(user => {
            if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
                return response
                    .status(401)
                    .json({ message: "You shall not pass!" });
            } else {
                return response
                    .status(200)
                    .json({ message: `${credentials.username} logged in...` });
            }
        })
        .catch(() => {
            return response
                .status(500)
                .json({ Error: "There was an error while logging in." })
        });
});