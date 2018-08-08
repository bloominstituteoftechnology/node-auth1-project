const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const db = require('./database/db');

const cors = require('cors');
const bcrypt = require('bcryptjs');

const port = 8000;
const server = express();

server.use (express.json());

server.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


server.get('/', (req, res) => {

  res.send('<h1>Authentication: </h1>  <br>  working on frontend client</h1> <h3>Sam Khaled</h3>');
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
const hash = bcrypt.hashSync(user.password, 10);
user.password = hash;

db('users').insert(user).then(response=> {

    res.status(200).json({Message:'Registration was successfully executed!'})
})
.catch(err=>{
    res.status(500).json(err);
})
})

server.post('/api/login', (req, res) => {
  const credentials = req.body;
  db('users')
  .where({ username: credentials.username })
  .first()
  .then(user => {
    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      return res.status(200).json({'message': 'You are now logged in.'})
    }
    return res.status(401).json({'errorMessage': 'wrong userID or password: You shall not pass!'})
  })
  .catch(err => {
    res.status(500).json({'error': 'wrong userID or password'})
  })
});






// server.listen(port, () => console.log(`\n Server is running on http://localhost:${port} === \n`));
server.listen(port, function() {
	console.log(`\n Server is running on http://localhost:${port} === \n`);
});