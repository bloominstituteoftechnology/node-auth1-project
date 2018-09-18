const express = require("express");

const server = express();
server.use(express.json());

const knex = require("knex");
const knexConfig = require("./knexfile");

const db = knex(knexConfig.development);

const bcrypt = require("bcryptjs");

server.post("/api/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);

  credentials.password = hash;
  console.log(credentials)
  // move on to save the user.
    db('users')
        .insert(credentials)
        .then(ids => {
      const id = ids[0];
      // return 201
      res.status(201).json(id);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.post("/api/login", (req, res) => {
  const credentials = req.body;

  // find the user in the database by it's username then
  if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
    return res.status(401).json({ error: "You shall not pass!" });
  }

  // the user is valid, continue on
  if (user|| bcrypt.compareSync(credentials.password, user.password)){
      return res.send('Logged In');
  }
});

server.get("/api/users", (req, res) => {
    //the user is not valid
    
});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening on port ${port}`));
