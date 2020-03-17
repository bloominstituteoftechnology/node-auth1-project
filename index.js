const express = require('express')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const configure = require('./config')

const port = 5000;
const server = express();

server.use(express.json())

server.use(session({
	name: 'token',
	secret: 'secret',
	cookie: {
		httpOnly: true
	},
	resave: false,
	saveUninitialized: false,
	store: new KnexSessionStore({
		knex: configure,
		createtable: true,
	}),
}))

server.use('/auth', authRouter)
server.use('/users', usersRouter)

server.get('/', (req, res) => {
    res.json({
        message: "You've made it here"
    })
})

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})