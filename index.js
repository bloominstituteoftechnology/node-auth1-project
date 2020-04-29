const express = require("express")
const cors = require("cors")
const cookieParser = require('cookie-parser');
const helmet = require("helmet")
const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")

const server = express()
<<<<<<< HEAD
const port = process.env.PORT || 5050
=======
const port = process.env.PORT || 5000
>>>>>>> 499f6eb45f845677a3ba4c45a63658dfc4cb8f07

server.use(cors())
server.use(helmet())
server.use(express.json())
server.use(cookieParser())

server.use("/auth", authRouter)
server.use("/users", usersRouter)

server.get("/", (req, res, next) => {
	res.json({
		message: "Welcome to our API",
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
