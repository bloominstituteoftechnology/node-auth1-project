const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const authentication = require("../auth/authentication.js");
const usersRouter = require("../users/usersRouter.js");
const authRouter = require("../auth/authRouter");

const server = express();

const sessionConfig = {
    name: "auth",
    secret: "authenticateUser",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        knex: require("../data/db-config.js"),
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
};


server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", authentication, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => res.json({ api: "up" }));

server.use((req, res, next) => next({ code: 404, message: `${req.method} ${req.url} not available` }));

server.use((err, req, res, next) => {
    res.status(err.code).json(err);
});

module.exports = server;