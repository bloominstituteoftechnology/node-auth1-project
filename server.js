const express = require('express');
const mongoose = require('mongoose');
const User = require('./auth/userModel.js');

const session = require('express-session');



mongoose.connect('mongodb://localhost/auth-i').then(() => {
  console.log('*** Connected to database ***');
});

const server = express();

server.use(express.json());

server.use(session({
  secret: 'Q4gG3XU929munG39JPhl3HavYkhqTkdv9E3rjaDKtexrZRxfM7'
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
        req.session.loggedInAs = user;
        res.json({ auth });
      }
      else res.status(401).json({ message: "Invalid password" });
    })
  })
})

server.post('/api/logout', (req, res) => {
  req.session.loggedInAs = null;
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

server.get('/api/whoami', (req, res) => {
  const { loggedInAs } = req.session;
  if (loggedInAs) res.json({ username: loggedInAs.username });
  else res.status(403).json({ message: "You are not logged in" });
});

server.listen(5000, () => {
  console.log('\n*** API running on port 5000 ***\n');
});
