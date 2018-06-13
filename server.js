const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const User = require('./User');

const db = require('./db.js');

const server = express();

db
  .connectTo('users')
  .then(() => console.log('\n... API Connected to Database ...\n'))
  .catch(err => console.log('\n*** ERROR Connecting to Database ***\n', err));

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => res.send('API Running...'));

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n\nAPI running on http://localhost:${port}`)
);

server.post('/api/register', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then( user => res.status(201).json('User added!'))
    .catch( err => res.status(500).send(err))
});

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  let query = User.find()
    query.where({ username: username })
    // check password
    // session
    query.then( user => res.status(200).json('Found user!'))
    query.catch( err => {
      res.status(500).json({ error: 'Error getting username', err});
    })
})

server.get('/api/users', (req, res) => {
  User.find()
    .then( users => res.status(201).json(users))
    .catch( err => res.status(500).send(err))
});




// POST	/api/login	Use the credentials sent inside the body to login the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, repond with the correct status code and the message: 'You shall not pass!'
// GET	/api/users	If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.
