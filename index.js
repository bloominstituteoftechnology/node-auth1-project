const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const db = require('./database/index.js');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

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
			res.status(200).send('Welcome')
		} else {
			res.status(401).json({ message: 'Wrong credentials.' });
		}
	} catch(err) {
		res.status(500).json(err);
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