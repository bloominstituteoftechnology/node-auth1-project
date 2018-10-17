const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

const authRoutes = require('./auth_helpers/authRoutes.js');

const server = express();

const sessionConfig = {
    secret: 'nobody-tosses.a%dwarf.!',
    name: 'user-session',
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 1
    },
};

server.use(session(sessionConfig));
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