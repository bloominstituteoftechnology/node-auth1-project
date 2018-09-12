
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

function protected(req, res, next){
  if(req.session && req.session.username){
      next();
  }else{
      res.status(401).json({ message: "you cannot come in"}); 
  }
}

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

server.get('/setname', (req, res) => {
  req.session.name = 'Frodo';
  res.send('got it');
});

server.get('/greet', (req, res) => {
  const name = req.session.username;
  res.send(`hello ${name}`);
});


server.get("/api/users", protected, (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get("/api/admins", protected, (req, res)=>{
  if(req.session && req.session.role === "admin"){
      db('users')
          .select('id', 'username', 'password')
          .then(users => {
              res.json(users);
          })
          .catch(err => res.send(err));
  }else(
      res.status(403).json({message: "You have no access to this information"})
  )
})

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});
 server.listen(3000, () => console.log("\nrunning on port 3000\n"));