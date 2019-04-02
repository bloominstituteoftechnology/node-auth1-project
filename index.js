//server moduke
const express = require('express');
//security module
const helmet = require('helmet');
//cors?
const cors = require('cors');
//password cryptography
// const bcrypt = require('bcryptjs');

//database model
// const Users = require('./data/users/users-model.js');

//server initialize
const server = express();

//middleware
server.use(helmet());
server.use(express.json());
server.use(cors());

//CRUD
//root GET
server.get('/', (req, res) => {
    res.send("Server Running");
});

//server port
const port = process.env.PORT || 7900;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));




