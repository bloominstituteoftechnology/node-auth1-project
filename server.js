const express = require('express');
const port = 5555;
const server = express();
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

// const projectsRoutes = require('./Routes/projectsRoutes')
// const actionsRoutes = require('./Routes/actionsRoutes')

// server.use('/projects', projectsRoutes)
// server.use('/actions', actionsRoutes)

server.get('/', (req, res) => {
	console.log('its working')
	res.status(200).send('its working')
})

server.get('/api/users', (req, res) => {
	db('users')
	.select('users.id', 'users.username')
	.then(response => {
		res.status(200).json(response)
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
				res.status(200).send('your logged in')
			} else {
				res.status(401).json({message: 'failed log in'})
			}
		})
		.catch(error => {
			console.log(error)
			res.json(500).json({msg: 'there was an error logging in'})
		})

})




server.listen(port, () => console.log(`server running on port 5555`));

