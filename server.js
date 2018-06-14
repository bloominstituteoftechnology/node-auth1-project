const express = require('express');
const mongoose = require('mongoose');
const User = require('./auth/userModel.js');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);



mongoose.connect('mongodb://localhost/auth-i').then(() => {
  console.log('*** Connected to database ***');
});

const server = express();


server.use(express.json());

const protected = (req, res, next) => {
  if (req.session && req.session.username) next();
  else res.status(401).json({ message: "Forbidden!"})
}

server.use(session({
  secret: 'Q4gG3XU929munG39JPhl3HavYkhqTkdv9E3rjaDKtexrZRxfM7',
  cookie: {
    maxAge: 3600000
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'Mr. F',
  store: new MongoStore({
        url: 'mongodb://localhost/auth-i-sessiondata'
  })
}));

server.get('/', (req, res,) => {
  res.json({ api: 'running...' })
});

server.get('/view-counter', (req, res) => {
	if (!req.session.viewCount) {
		req.session.viewCount = 0;
	}
	req.session.viewCount++;
	res.json({ viewCount: session.viewCount })
})

server.post('/api/login', (req,res) => {
  const { username, password } = req.body
  User.findOne({ username }, (err, user) => {
    if (err) res.status(500).json({ err })
    else user.comparePassword(password, (err, auth) => {
      if (err) res.status(500).json({ err });
      else if (auth) {
        req.session.username = username;
        res.json({ message: "Logged in successfully" });
      }
      else res.status(401).json({ message: "Invalid password" });
    })
  })
})

server.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) res.json({ err });
    else res.json({ message: "Logged out." })
  })
  res.json({ message: "Logged out." });
});

server.post('/api/register', (req, res) => {
  User.create(req.body)
  .then(user => {
    res.status(201).json({ user });
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

server.get('/api/whoami', protected, (req, res) => {
  res.json({ username: req.session.username });
});

server.get('/api/users', protected, (req,res) => {
  User.find()
    .select('-password')
    .then(users => {
      res.json({ users });
    })
    .catch( err => {
      res.status(500).json({ err });
    });
});
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('\n*** API running on port 5000 ***\n');
});
