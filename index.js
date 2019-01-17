const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./data/dbConfig');

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(helmet());
app.use(logger('dev'));
app.use(session({cookie: {}}));

app.get('/', (req, res) => {
  res.json({message: 'your app is running!'});
});

app.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 14);
  console.log('user', user);
  db('users').insert(user)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

app.post('/api/login', (req, res) => {
  const userBody = req.body;
  db('users').where('username', userBody.username)
    .then(users => {
      if (users.length && bcrypt.compareSync(userBody.password, users[0].password)) {
        req.session.cookie = {userId: users[0].id}
        res.json({message: 'Logged in', cookie: req.session.cookie});
      } else {
        res.status(404).json({err: 'invalid username or password'});
      }
    })
    .catch(err => {
      res.status(500).json({err});
    });
});

app.listen(PORT, () => {
  console.log(`app is running on PORT: ${PORT}`);
});
