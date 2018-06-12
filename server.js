const express = require("express");
const mongoose = require('mongoose');
const server = express();
const session = require("express-session");
const port = 5555;
const usersRouter = require("./routes/usersRouter");

const sessionOptions = {
  secret: "you can't see me",
  cookie: {
    maxAge: 1000 * 60 * 60
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: "tryagain"
};

server.use(express.json());
server.use(session(sessionOptions));

server.use("/", usersRouter);

mongoose.connect("mongodb://localhost/userdb")
  .then(() => {
    console.log("Connected to Mongo");
  })
  .catch(() => {
    console.log("Error can't connect to Mongo");
  })


server.get("/", (req, res) => {
  if(req.session && req.session.username) {
    res.json({message: `Welcome back ${req.session.username}`});
  } else {
    res.status(401).json({message: "Please log in first"});
  }
})



server.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
