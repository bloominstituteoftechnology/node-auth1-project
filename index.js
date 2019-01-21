const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');
const register = require('./api/register')
//const login = require('./api/login');

//connection to the data base
const db = knex(knexConfig.development);
const server = express();

server.use(helmet());
server.use(express.json());

server.get('/', (req,res) => {
    res.send("It is working");
});

server.get('/api/users', async (req, res) => {
    const usersList = await db('users').select('id', 'username', 'password');
        try {
            res.json(usersList);
        }
        catch (err){
            res.status(500).json({message: "There was an error trying to retrieve users from the data base"})
        }
  });

server.use('/api/register', register);
//server.use('/api/login', login);

server.listen(9000, () => console.log('\n Api is running \n'));