const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const db = require('./data/db');
const session = require('express-session');

const server = express();

server.use(express.json());

server.use(morgan('dev'));


server.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 }}));


server.get('/', (req, res)=> {
        res.send('hELLO... teSTING');

});


server.get('/api/users', (req, res)=> {
	
	if(req.session.logged){
		db('users')
		.then(response =>{
			res.status(200).json(response);
		
		})
		
		.catch(err => {
			res.status(500).json(err);
		});
	
	}

	else res.status(401).send('You shall not pass');
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
			req.session.logged = true;
			req.session.cookie.userId = user.id;

			res.status(200).send(`Logged In with userId ${req.session.cookie.userId}`);
		}
		else{
			res.status(401).json({error: 'Incorrect credentials'});
		}
	})
	
	.catch(err => {
		res.status(500).json(err);
	});

});


server.get('/api/restricted/something', (req, res) => {
	
	if(req.session.logged) res.status(200).send("Logged in");
	else res.status(500).send('You shall not pass');

});



server.use((req, res)=> {
	 res.status(404).send("Wrong URL. Please provide a correct URL");
});


server.listen(4002, ()=>  console.log('API listening on port 4002'));
