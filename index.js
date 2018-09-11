const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./database/index.js');

const app = express();

app.use(
  session({
    name: 'test', // default is connect.sid
    secret: 'jhk secret code',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
      // change to true in production environment
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());

app.get('/greet', (req, res) => {
	res.send(`Hello ${req.session.username}`);
})

app.post('/api/register', async (req,res) => {
	const creds = req.body;
	const hash = bcrypt.hashSync(creds.password, 12);
	creds.password = hash;
	try {
		const id = await db('users').insert(creds)
		res.status(201).json(id)
	} catch(err) {
		res.status(500).json(err);
	}
});

app.post('/api/login', async (req, res) => {
	const creds = req.body;
	try {
		const user = await db('users').where({ username: creds.username }).first()
		if (user && bcrypt.compareSync(creds.password, user.password)) {
			req.session.username = user.username;
			res.status(200).send(`Welcome ${req.session.username}!`);
		} else {
			res.status(401).json({ message: 'Wrong credentials.' });
		}
	} catch(err) {
		res.status(500).json(err);
	}
});

app.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});

app.get('/api/users', async (req, res) => {
	try {
		const users = await db('users').select('id', 'username');
		res.status(200).json(users)
	} catch(err) {
		console.log(err);
		res.status(500).json({ message: 'Something went wrong, please try again.' });
	}
})

app.listen(9000, () => {
	console.log('API server running on Port 9000');
})