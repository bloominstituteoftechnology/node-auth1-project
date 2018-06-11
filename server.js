const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const cbrypt = require('bcrypt');

//connecting to mongo
mongoose
    .connect('mongodb://localhost/userdb')
    .then(mongo => {
        console.log('connected to database');
    })
    .catch(err => {
        console.log('Error connecting to database', err)
    });

const userController = require('./user/userController');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running' });
});

server.use('/api/users', userController);

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`\n=== API up on port: ${port} ===\n`));
