
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database/dbConfig.js");
const session = require('express-session'); 
const KnexSessionStore = require('connect-session-knex')(session);

const server = express();

const sessionConfig = {
  name: 'cookie time', 
  secret: "sugar sugar", 
  cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, 
      secure: false,
  }, 
  httpOnly: true, 
  resave: false, 
  saveUninitialized: false, 
  store: new KnexSessionStore({
      tablename: "sessions", 
      sidfieldname: "sid", 
      knex: db, 
      createtable: true, 
      clearInterval: 1000 * 60 * 60, 
  }), 
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());



 server.get("/", (req, res) => {
  res.send("Test");
});

server.post("/api/register", (req, res)=>{
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 12); 
  creds.password = hash; 
  db("users")
      .insert(creds)
      .then(ids =>{
          const id = ids[0]; 
          res.status(201).json(id);
      })
      .catch(err=>res.status(500).send(err)); 
})
server.post("/api/login", (req, res)=>{
  const creds = req.body; 
  db("users")
  .where({username: creds.username})
  .first()
  .then(user=>{
      if(user && bcrypt.compareSync(creds.password, user.password)){
          res.status(201).json({message: "Welcome"})
      }else{
          res.status(404).json({ message: "No User Matching" })
      }
  })
  .catch(err => res.status(500).send(err)); 
})
server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

 server.listen(3000, () => console.log("\nrunning on port 3000\n"));