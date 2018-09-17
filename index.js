//module import
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs')
//knex config
const dbConfig = require('./knexfile.js')
const db = knex(dbConfig.development);
//server config
const server = express();
//
server.use(express.json());
server.use(helmet());


//----POST ------//
//register
server.post("/api/register", (req, res) => {
 const credentials = req.body;
 const hashnum = bcrypt.hashSync(credentials.password, 14);
 credentials.password = hashnum;

 db("credentials")
   .insert(credentials)
   .then(users => {
     const id = users[0];

     res.status(201).json(id);
   })
   .catch(err => res.status(500).send(err));
});

//login
server.post("/api/login", (req, res) => {
 const credentials = req.body;
 db("credentials")
   .where({ username: credentials.username })
   .first()
   .then(user => {
     if (user && bcrypt.compareSync(credentials.password, user.password) ) {
       res.status(200).send("Hello my friend, nice to see you again");
     }
     else {
       res.status(401).json({ message: "Man you can't even type right " });
     }
   })
   .catch(err => res.status(500).send(err));
});

//------GET-------//
server.get("/api/users", (req, res) => {
 db("credentials")
   .select("id", "username")
   .then(users => {
     res.json(users);
   })
   .catch(err => res.status(500).send(err));
});

//-------Listener--------//
const port = 8000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
