const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('./api');

const server = express();

server.use(express.json());
server.use(cors({}));
server.use(helmet());

// session setup
server.use(
  session({
    secret: 'nobody tosses a dwarf!',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: false,
    resave: false,
    saveUninitialized: false,
  })
);

server.use('/api', apiRoutes);

const PORT = 8000;
server.listen(PORT, () => console.log(`SERVER = PORT: ${PORT} = LISTENING`));
