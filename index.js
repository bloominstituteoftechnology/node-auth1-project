
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database/dbConfig.js");

const server = express();

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