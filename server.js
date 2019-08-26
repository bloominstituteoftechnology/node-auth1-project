const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./helpers/user-helper');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.get('/', (req, res) => {
  res.send('<h1> WeB AuTh<h1>');
});

//GET ALL USERS

server.get('/api/users', async (req, res) => {
  try {
    const users = await db.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res
        .status(400)
        .json({ message: 'Bad request. We are unablet to get the users.' });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong with this request.', error: err });
  }
});

//REGISTER

server.post('/api/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong with this request.',
        error: error
      });
    });
});

//LOGIN

server.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    db.find(username)
      .first()
      .then(user => {
        console.log(user);
        console.log(user.password);
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res
            .status(401)
            .json({ message: 'Ivaild username and password combination.' });
        } else {
          return res.status(200).json({ message: `Hello, ${username}!!! ` });
        }
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong with your request.', error: err });
  }
});

module.exports = server;
