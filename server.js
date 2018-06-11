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
	const session = req.session
	if (!session.viewCount) {
		session.viewCount = 0;
	}
	session.viewCount++;
	res.json({ viewCount: session.viewCount })
	// req.session is a persistent object that you'll see across requests for the same client
// contains all the session variables that you set
}) // First get request is 1, second is 2 / Doesn't just persist across one route

server.post('/api/register', (req, res) => {
  User.create(req.body)
  .then(user => {
    res.status(201).json({ user });
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

server.listen(5000, () => {
  console.log('\n*** API running on port 5000 ***\n');
});
