const express = require('express');
const mongoose = require('mongoose');
const User = require('./auth/userModel.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');



mongoose.connect('mongodb://localhost/auth-i').then(() => {
  console.log('*** Connected to database ***');
});

const server = express();

server.use(cookieParser());

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
        res.cookie('cs10logincookie', user._id, {maxAge : 360000}).json({ message: "Logged in!" });
      }
      else res.status(401).json({ message: "Invalid password" });
    })
  })
})

server.post('/api/logout', (req, res) => {
  res.clearCookie('cs10logincookie');
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
  if (req.cookies.cs10logincookie) {
    User.findById(req.cookies.cs10logincookie)
      .then(user => {
        res.json({ user });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
  else res.status(403).json({ message: "You are not logged in" });
});

server.get('/api/users', (req,res) => {
  if (req.cookies.cs10logincookie) {
    User.find()
      .select('-password')
      .then(users => {
        res.json({ users });
      })
      .catch( err => {
        res.status(500).json({ err });
      });
  }
  else res.status(403).json({ message: "You are not logged in" });
});

server.listen(5000, () => {
  console.log('\n*** API running on port 5000 ***\n');
});
