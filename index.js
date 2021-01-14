const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require('express-session')
const connectSessionKnex = require('connect-session-knex')(session)
const usersRouter = require("./users/users-router")
const db = require('./database/config')

const server = express()
const port = process.env.PORT || 5000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
	resave: false,
	saveUninitialized: false,
	secret: "keep it secret, keep it safe",
	store: new connectSessionKnex({
		knex: db, // config instance of knex
		createTable: true, // create table for session if it doesn't exist

	})
}))

server.use(usersRouter)

server.use((err, req, res, next) => {
	console.log(err)

	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})
