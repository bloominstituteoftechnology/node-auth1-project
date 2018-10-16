const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const session = require('express-session');
const sessionConfig = {
    name: 'session',
    secret: "Hello I am a horse",
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
};

const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);
const server = express();
server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

function protected(request, response, next) {
    if (request.session && request.session.username) {
        next();
    } else {
        response
            .status(401)
            .json({ message: "You shall not pass!" });
    }
}

const port = 8000;
server.listen(port, () => console.log(`API running on port ${port}`));

// checker endpoint
server.get('/', (request, response) => {
    response.send('Server initialized.');
});

// register/login POST requests
server.post('/api/register', (request, response) => {
    const credentials = request.body;

    const hashedPW = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hashedPW;

    db('users')
        .insert(credentials)
        .then(ids => {
            const id = ids[0];
            request.session.username = credentials.username;
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
                request.session.username = user.username;
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

// user list and logout GET requests
server.get('/api/users', protected, (request, response) => {
    request.session.name = '12345';
    const sessionName = request.session.name;

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
                .json({ Error: "Could not find list of users." });
        });
});

server.get('/api/logout', (request, response) => {
    if (request.session) {
        request.session.destroy();
        return response
            .status(200)
            .json({ message: "User logged out." });
    } else {
        return response
            .status(500)
            .json({ message: "Unable to log out." });
    }
});