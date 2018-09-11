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
const KnexSessionStore = require("connect-session-knex")(session)

const db = require("./db/dbConfig.js");

const server = express();

//Middleware
server.use(helmet());
server.use(morgan("short"));
server.use(express.json());
server.use(cors());

server.use(
  session({
    name: 'Lion',//default is connect.sid
    secret: 'no whispering in the library!',
    cookie : {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https.
      //Server will not send back a cookie over http.
      //false for development. 
      httpOnly: true, // don't let JS code access cookies. 
      //Browser extensions run JS code on your browser!
      resave: false, 
      saveUninitialized: false, 
      store: new KnexSessionStore ({
        tablename : "sessions", 
        sidefieldname : 'sid', 
        knex: db, 
        createtable : true, 
        clearInterval: 1000 * 60 * 60, 
      })
    }
  })
);

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

server.get("/setname", (req,res) => {
  //req.session = {};
  //^using this provides TypeError: req.session.touch 
  // is not a function error message. 
  req.session.name = "newestCurrentSession"
  res.send('Set up')
})

server.get('/greet', (req,res) => {
  const name = req.session.name; 
  res.send(`hello ${name}`)
})

PORT = 9000;

server.listen(PORT);
