const express = require("express");
const mongoose = require("mongoose");

// connect to mongodb
mongoose
	.connect("mongodb://localhost/authNdb")
	.then(connection => {
		console.log("\n===connected to mongo===\n");
	})
	.catch(err => {
		console.log("error connecting to mongo", err);
	});

const server = express();

// middleware

// routes
server.get("/", (req, res) => {
	res.send({ route: "/", message: "made it to home page" });
});

server.listen(5000, () => {
	console.log("\n===api running on 5000===\n");
});
