const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const loginRouter = require("./Authentication/routes/loginRoutes");
const registerRouter = require("./Authentication/routes/registerRoutes");
const userRouter = require("./Authentication/routes/usersRoutes");
const restrictedRouter = require("./Authentication/routes/restrictedRoutes")
const signedInOrNot = require("./middleware/signedInOrNot")
const logoutRouter = require("./Authentication/routes/logoutRoutes");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")

const server = express();

//Middleware
server.use(helmet());
server.use(morgan("short"));
server.use(express.json());
server.use(cors());
//Routers
const LOGIN = "/api/login";
const LOGOUT = "/api/logout"; 
const REGISTER = "/api/register";
const USERS = "/api/users";
const RESTRICTED = "/api/restricted"
server.use(LOGIN, loginRouter);
server.use(LOGOUT,logoutRouter);
server.use(REGISTER, registerRouter);
server.use(USERS, userRouter);
server.use(RESTRICTED, signedInOrNot)
//Routers^
//Middleware^

server.get("/", (req, res) => {
  res.send("Server started");
});

PORT = 9000;

server.listen(PORT);
