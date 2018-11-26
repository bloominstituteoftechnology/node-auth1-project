const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig');

const server = express();

server.use(express.json());
// REGISTER
server.post('/api/register', async (req, res) => {
  // get form input values
  const registrationData = req.body;
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

server.get('/', (req, res) => {
  res.send('Helllo there.');
});

server.listen(3300, () => console.log('Server started on port 3300'));
