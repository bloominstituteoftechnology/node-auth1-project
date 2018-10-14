const express = require('express');
const server = express();
const port = 5555;
const session = require('express-session');
const helmet = require('helmet')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const morgan = require('morgan')
const knex = require('knex')
const dbConfig = require('./knexfile')
const db = knex(dbConfig.development)
server.use(express.json());
server.use(helmet());
server.use(morgan('tiny'))
server.use(cors()) 


// configure express-session middleware
server.use(
  session({
    name: 'tom', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: true,
  })
);


function protected(req, res, next){
	if(req.session && req.session.name === "eric"){
		// console.log('your in')
		// db('users')
		// .select('users.id', 'users.username')
		// .then(response => {
		// 	res.status(200).json(response)
		// })
		// console.log(req.session)

		//if I wanted to check for rolls make a many to many
		//relationship then check the roll on that user
		//decide what to do based on that roll
		//return function that has a return value that looks
		//into our database and gets the roles for the user
		//then I could display that in the view

		next();
	} else {
		return res.status(401).json({error: "incorrect credentials"})
	}
}

//many to many relationship on users and roles

server.get('/api/users', protected, (req, res) => {
	db('users')
		.select('users.id', 'users.username')
		.then(response => {
			res.status(200).json(response)
		})
		.catch(error => {
			console.log(error)
			res.status(500).json({msg: 'there was an error'})
		})
})

server.post('/api/register', (req, res) => {
	const creds = req.body
	const hash = bcrypt.hashSync(creds.password, 10);
	creds.password = hash;
	db('users')
		.insert(creds)
		.then(ids => {
			const id = ids[0];
			req.session.name = user.username
			res.status(201).json(id)
		})	
		.catch(error => {
			console.log(error)
			res.status(500).json({msg: 'there was an error creating password'})
		})
})

server.post('/api/login', (req, res) => {
	const creds = req.body
	db('users')
		.where({username: creds.username})
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				req.session.name = user.username
				res.send(`welcom ${user.username}, your logged in`)
			} else {
				res.status(401).json({message: 'failed log in'})
			}
		})
		.catch(error => {
			console.log(error)
			res.json(500).json({msg: 'there was an error logging in'})
		})
})

server.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.send('error logging out');
			} else {
				res.send('you are logged out');
			}
		})
	}
})


server.listen(port, () => console.log(`server running on port 5555`));

