const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const db = require('./database/db');

const bcrypt = require('bcryptjs');

const port = 8000;
const server = express();

server.use (express.json());


server.get('/', (req, res) => {

  res.send('<h1>Authentication: working on MVP</h1>  <br>  <p>Part one, due Monday: <br><br>  Use Node.js, Express and Knex to build an API that provides Register and Login functionality using SQLite to store User information. <br><br>  Make sure the password is not stored as plain text.</p>');
});

server.get('/api/users', (req, res) => {
	db('users')
		.then(users => {
			res.status(200).json(users);
		})
		.catch(error => {
			res.status(500).json(error);
		})
});

server.post('/api/register', (req, res, next) => {
const user = req.body;
//hash pw
const hash = bcrypt.hashSync(user.password, 14);
user.password = hash;

//post to db
db('users').insert(user).then(response=> {
    res.status(200).json({Message:'Registration was successfully executed!'})
})
.catch(err=>{
    res.status(500).json(err);
})
})







// server.listen(port, () => console.log(`\n Server is running on http://localhost:${port} === \n`));
server.listen(port, function() {
	console.log(`\n Server is running on http://localhost:${port} === \n`);
});