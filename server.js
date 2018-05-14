const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

// connect to mongodb
mongoose
	.connect("mongodb://localhost/authNdb")
	.then(connection => {
		console.log("\n===connected to mongo===\n");
	})
	.catch(err => {
		console.log("error connecting to mongo", err);
	});

// sub-applications
const Register = require("./register/Register");
// const Login = require("./login/Login");
// const Users = require("./users/Users");

const server = express();

// middleware
server.use(express.json());
server.use(helmet());

// routes
server.get("/", (req, res) => {
	res.send({ route: "/", message: "made it to home page" });
});

// create a user with a hashed password
server.use("/api/register", Register);
// validate login and create a new session for a user
// server.use("/api/login", Login);
// send an array of all users in the database
// server.use("/api/users", Users);

server.listen(5000, () => {
	console.log("\n===api running on 5000===\n");
});
