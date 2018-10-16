const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);
const server = express();
server.use(helmet());
server.use(express.json());

const port = 8000;
server.listen(port, () => console.log(`API running on port ${port}`));

server.use(
    session({
        name: 'session',
        secret: "Hello I am a horse",
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: true
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false
    })
);

// checker endpoint
server.get('/', (request, response) => {
    response.send('Server initialized.');
});

// user endpoints
server.post('/api/register', (request, response) => {
    const credentials = request.body;

    const hashedPW = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hashedPW;

    db('users')
        .insert(credentials)
        .then(ids => {
            const id = ids[0];
            return response
                .status(201)
                .json({ newUserId: id });
        })
        .catch(() => {
            return response
                .status(500)
                .json({ Error: "There was an error while creating the user." })
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

server.get('/api/users', (request, response) => {
    request.session.name = '12345';
    const sessionName = request.session.name;
    console.log(request.session);

    db('users')
        .select('id', 'username', 'password')
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