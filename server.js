const express = require('express');
const server = express();
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authdb')
  .then( () => console.log('connected to mongodb'))
  .catch( err => console.log(err));

server.listen(5000, () => console.log('server running on port 5000'));

server.use(express.json());

const sessionConfig = {
  secret: 'doh!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  }, // 1 day in milliseconds
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10,
  }),
};

server.use(session(sessionConfig));

const auth = (req, res, next) => {
  if (req.session && req.session.username) return next();

  res.status(401).send("You shall not pass!");
}

server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.send(`welcome back ${req.session.username}`);
  } else {
    res.send('who are you?');
  }
});

server.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  console.log('user is ', user);
  const valid =  user && await user.isPasswordValid(password);

  if (valid) {
    req.session.username = user.username;
    res.send('ur logged in!  have a cookie');
  } else {
    res.status(401).send('invalid credentials');
  }
});

server.post('/api/register', async (req, res) => {
  const user = new User(req.body);

  user.save()
    .then(user => res.status(201).send(user))
    .catch(err => {
      console.log(err);
      res.status(500).send(err)
    });
});

server.get('/api/users', async (req, res) => {
  const users = await User.find({});

  res.status(200).json(users);
});
