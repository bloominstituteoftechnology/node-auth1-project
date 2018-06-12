const express = require("express");
const server = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const port = process.env.PORT || 5000;

//Routes

//const registerController = require('./register/registerController')
const userController = require("./users/userController");
//const loginController = require("./login/loginController");
const User = require("./users/userController");

//Local MiddleWare

const sessionOptions = {
  secret: "nobody tosses a dwarf!",
  cookie: {
    maxAge: 1000 * 60 * 60 // an hour
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: "noname"
};

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "you shall not pass!!" });
  }
}

//Gobal Middleware

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

//Endpoints

//server.use("/api/login", loginController);
server.use("/api/user", userController);
//server.use('/api/register', registerController)

server.get("/", (req, res) => {
  res.status(200).json({ API: "is up and running" });
});

server.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        user
          .validatePassword(password)
          .then(passwordsMatch => {
            if (passwordsMatch) {
              req.session.username = user.username;
              res.send("Have a cookie");
            } else {
              res.status(401).send("You shall not pass!");
            }
          })
          .catch(err => {
            res.send("error comparing password");
          });
      } else {
        res.status(401).send("You shall not pass!");
      }
    })
    .catch(err => {
      res.send(err);
    });
});

//Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/auth-i")
  .then(() =>
    console.log("\n*** API Connected to MongoDB at localhost/27017 ***\n")
  )
  .catch(err => console.log("\n*** ERROR Connecting to Database ***\n", err));

server.listen(port, () => {
  console.log(`*** Server up and running on ${port} ***`);
});
