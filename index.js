const express = require('express')
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const db = require('./data/dbconfig')
const appRouter = require("./routers/approuter");

const server = express()
const PORT = process.env.PORT || 8001; // change to the port you would like to use

server.use(express.json())

server.use(session({
	resave: false, // avoids recreating sessions that have not changed
    saveUninitialized: false, // comply with GDPR laws
    name:"ellie",
	secret: "seaqwit",
	store: new KnexSessionStore({
		knex: db, // configured instance of Knex, or the live database connection
		createtable: true, // if the session table does not exist, create it
	}),
}))

server.use(appRouter)

server.use((err, req, res, next) => { // catchall error middleware.  
	console.log(err)
	res.status(500).json({
		message: "Catch All Error Handler: Something went wrong",
	})
})

server.listen(PORT, () => { 
  console.log(`\n== API running on port ${PORT} ==\n`);
});