require('dotenv').config();

const db = require('./data/db_model');
const express = require('express');
const helmet = require('helmet');

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
const port = process.env.PORT || 3000; 

server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});


server.get("/api/users/:id",
  (req,res) => db.find(req.body.username, req.body.token, req.params.id)
  .then(result => res.status(200).json(result))
  .catch(err => res.status(400).json({error: err, message: "could not gather from database"}))
);

server.get("/api/users/",
(req,res) => 
db.find(req.body.username, req.body.token)
.then(result => res.status(200).json(result))
.catch(err => res.status(400).json({error: err, message: "could not gather from database"}))
);

server.post("/api/register",
  (req,res,next) =>
  {
  db.userExists(req.body.username).then(() => 
  {
    //check password here
    db.register(req.body.username, req.body.password)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json({error: err, message: "interal error"}))
  }
  )
  .catch(err => res.status(400).json({error: err, message: "username is already in use"}))
  }
);

server.post("/api/login",
  (req,res,next) => 
  db.login(req.body.username, req.body.password)
  .then(result => res.status(201).json(result))
  .catch(err => res.status(400).json({error: err, message: "Zoo must have a unique name"}))
);


/* server.delete("/api/zoos/:id", 
  (req,res) => db.remove(req.data.id)
  .then(() => res.status(202).json({message: "you have deleted an item"}))
  .catch(err => res.status(400).json({error: err, message: "Zoo exists but could not be deleted."}))
) */

/* server.put("/api/zoos/:id", 
  validator.validateAccountId,
  validator.validateAccount,
  (req,res) => db.update(req.params.id, req.data)
  .then(result => res.status(203).json(result))
  .catch(err => res.status(400).json({error: err, message: "Zoo exists but could not be updated"}))
) */

function logger(req,res,next)
  {
    console.log(`${req.method} is being used at ${req.url} at ${Date.now()} ${res.body && (res.method === "post" || res.method === "put") `with ${res.body} data`}`);
    next();
  }