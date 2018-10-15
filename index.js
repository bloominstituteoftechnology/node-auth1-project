const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const db = require('./data/dbConfig.js');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());

server.post('/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db('users')
        .insert(credentials)
        .then((ids) =>{
            const id = ids[0];
            res.status(201).json({newUserId: id});
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

server.post('/login', (req, res) => {
	const creds = req.body;
	db('users')
		.where({username: creds.username})
		.first()
		.then((user) => {
			if(user && bcrypt.compareSync(creds.password, user.password)) {
				res.status(200).json({message: 'Welcome home. Country roads!'});
			} else {
				res.status(401).json({message: 'you shall not pass!'});
			}
		})
		.catch((err) => {
			res.status(500).json({err});
		});
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

server.use((req, res) => {
    res.status(404).json({"error": `The requested path '${req.url}' doesn't exist.`});
});

const port = 8080;
server.listen(port, () => console.log(`\n~~~ Server listening on port ${port} ~~~\n`));
