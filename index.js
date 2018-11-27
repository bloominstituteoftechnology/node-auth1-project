const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/helpers');

const server = express();

server.use(express.json());

// REGISTER
server.post('/api/register', async (req, res) => {
  // get form input values
  const registrationData = req.body;
  // validate data
  if (!registrationData.username || !registrationData.password) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid username and password.' });
  }
  // Check if user already exists
  try {
    const userInDb = db.getByUsername(registrationData.username);
    return userInDb
      ? res.status(422).json({ message: 'That username already exists.' })
      : null;
  } catch (error) {
    err => res.status(500).json({ message: err });
  }
  // registrationData.username
  // generate a hash
  const hash = bcrypt.hashSync(registrationData.password, 10);
  // replace plain text with hash
  registrationData.password = hash;
  // save to db
  try {
    const newUserId = await db('users').insert(registrationData);
    res.status(201).json(newUserId);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong with the request.' });
  }
});

// LOGIN
server.post('/api/login', async (req, res) => {
  // get form input values
  const loginData = req.body;
  // get user
  try {
    const user = await db.getByUsername(loginData.username);
    return user && bcrypt.compareSync(loginData.password, user.password)
      ? res.status(200).json({ message: 'Logged in.' })
      : res
          .status(401)
          .json({ message: 'The username or password does not match.' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong, pal.' });
  }
});

// GET USERS
server.get('/api/users', async (req, res) => {
  try {
    const users = await db.select('username').from('users');
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong getting the users.' });
  }
});

server.get('/', (req, res) => {
  res.send('Helllo there.');
});

server.listen(3300, () => console.log('Server started on port 3300'));
