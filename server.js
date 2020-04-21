const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const authRouter = require("./auth/auth-router.js");
const usersRouter = require("./users/users-router.js");
const dbConfig = require("./data/config.js");

const server = express();

server.use(cors());
server.use(helmet());

server.use(express.json());
server.use(
	session({
		name: "token",
		resave: false,
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET || "secret",
		cookie: {
			httpOnly: true
		},
		store: new KnexSessionStore({
			knex: dbConfig,
			createtable: true
		})
	})
);

server.use("/auth", authRouter);
server.use("/users", usersRouter);

server.get("/", (req, res) => {
	res.send(`<h2>Auth 1 Project!</h2>`);
});

module.exports = server;