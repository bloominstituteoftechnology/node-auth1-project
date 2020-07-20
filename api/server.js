const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcryptjs = require("bcryptjs"); // 
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const dbConnection = require("../database/connection.js");

//update the following ?

const usersRouter = require("../users/users-router.js"); 
const authRouter = require("../auth/auth-router.js");
const authenticate = require("../auth/authenticate-middleware.js");

const server = express();

const sessionConfiguration = {
    name: "testsession", // default value is sid
    secret: process.env.SESSION_SECRET || "the password is password", // key for encryption
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: process.env.USE_SECURE_COOKIES || false, // send the cookie only over https (secure connections)
        httpOnly: true, // prevent JS code on client from accessing this cookie
    },
    resave: false,
    saveUninitialized: true, // read docs, it's related to GDPR compliance
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 30, // time to check and remove expired sessions from database
    }),
};

server.use(session(sessionConfiguration)); // enables session support
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", authenticate, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

module.exports = server;
