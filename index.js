const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const loginRouter = require("./Authentication/routes/loginRoutes");
const registerRouter = require("./Authentication/routes/registerRoutes");
const userRouter = require("./Authentication/routes/usersRoutes");
const server = express();

//Middleware
server.use(helmet());
server.use(morgan("short"));
server.use(express.json());
server.use(cors());
//Routers
const LOGIN = "/api/login";
const REGISTER = "/api/register";
const USERS = "/api/users";

server.use(LOGIN, loginRouter)
server.use(REGISTER, registerRouter)
server.use(USERS, userRouter)
//Routers^
//Middleware^

server.get("/", (req, res) => {
  res.send("Server started");
});

PORT = 9000;

server.listen(PORT);
