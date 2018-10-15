const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const server = express();

const db = knex(knexConfig.development);

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
	res.send("Its Alive!");
});

server.get("/api/users", (req, res) => {
	db("users")
		.select("id", "username", "password")
		.then(users => {
			res.json(users);
		})
		.catch(err => res.send(err));
});

server.post("/api/register", (req, res) => {
	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 15);
	credentials.password = hash;

	db("users")
		.insert(credentials)
		.then(ids => {
			res.status(201).json({ id: ids[0] });
		})
		.catch(err => {
			res.status(500).json({ error: "could not create user" });
		});
});

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
