const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const userRouter = require('../user/userRouter');
const authRouter = require('../auth/router');
const restricted = require('../auth/restricted-middleware');


const server = express();

const sessionConfig = {
    name: 'Snickers',
    secret: 'Youre not the same when youre hangry',
    cookie: {
        maxAge: 1000 * 60 * 30,
        secure: false,
        httpOnly: true
    },

    resave: false,
    saveUninitialized: true,
}

server.get('/', (req,res) => {
    res.json({
        api: 'up'
    });
});

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/user', restricted, userRouter);
server.use("/api/auth", authRouter);

module.exports = server;