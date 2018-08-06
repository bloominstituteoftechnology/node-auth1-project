const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const db = require('./data/db');

const server = express();

server.use(express.json());

server.use(morgan('dev'));



server.get('/', (req, res)=> {
	res.send('hELLO... teSTING');

});


server.post('/api/register', (req, res)=> {

	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 14);
	credentials.password = hash;


	db('users')
	.insert(credentials)
	
	.then(ids =>{

		db('users')
		.where('id', ids[0])
		.first()
		.then(user => {
	          res.status(200).json(user);	
		})
	})

	.catch(err =>{
		if(err.message.includes('UNIQUE constraint failed: users.username')) res.status(500).json({errorMessage:"username already taken, use another username"});
		else res.status(500).json(err);
	});
});


server.post('/api/login', (req, res)=> {
	
	const credentials = req.body;

	db('users')
	.where({username: credentials.username})
	.first()
	.then(user =>{
		if(user && bcrypt.compareSync(credentials.password, user.password)) {
			res.status(200).send('Welcome');
		}
		else{
			res.status(401).json({error: 'Incorrect credentials'});
		}
	})
	
	.catch(err => {
		res.status(500).json(err);
	});

});


server.use((req, res)=> {
	 res.status(404).send("Wrong URL. Please provide a correct URL");
});


server.listen(4002, ()=>  console.log('API listening on port 4002'));
