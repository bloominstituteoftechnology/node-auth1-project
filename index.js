const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const server = express();
const session = require("express-session");

const sessionConfig = {
	secret: "some.will.know.where.to.go",
	name: "Ooga-Booga",
	httpOnly: true,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: 1000 * 60 * 1
	}
};

server.use(session(sessionConfig));

const db = knex(knexConfig.development);

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
	res.send("Its Alive!");
});

server.get("/api/users", (req, res) => {
	console.log(req.session);
	if (req.session && req.session.username) {
		db("users")
			.select("id", "username", "password")
			.then(users => {
				res.json(users);
			})
			.catch(err => res.send(err));
	} else {
		res.status(401).send("Not Authorized");
	}
});

server.get("/logout", (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.send("You cant leave!");
			} else {
				res.send("goodbye!");
			}
		});
	} else {
		res.send(500).send("No Session To Log Out From");
	}
});

server.post("/api/register", (req, res) => {
	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 15);
	credentials.password = hash;
	//Cookie made for session
	req.session.username = credentials.username;

	db("users")
		.insert(credentials)
		.then(ids => {
			res.status(201).json({ id: ids[0] });
		})
		.catch(err => {
			res.status(500).json({ error: "could not create user" });
		});
});

server.post("/api/login", (req, res) => {
	const creds = req.body;
	db("users")
		.where({ username: creds.username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				//Cookie made for session
				req.session.username = user.username;
				res.status(201).json({ welcome: user.username });
			} else {
				res
					.status(500)
					.json({ error: "Wrong Username and/or Password, please try again" });
			}
		});
});

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
