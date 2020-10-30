const express = require('express')

const server = express()

const usersRouter = require("./users/users-router")
server.use(usersRouter)
server.use(express.json())
const port = process.env.PORT || 4000



server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})
server.listen(port, () => {
    console.log(`server running on ${port}`)
})