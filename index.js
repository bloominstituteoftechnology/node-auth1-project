const express = require("express");

const server = express();
server.use(express.json());

const knex = require("knex");
const knexConfig = require("./knexfile");

const db = knex(knexConfig.development);

const bcrypt = require("bcryptjs");

server.post("/api/register", (req, res) => {
  const user = req.body;
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);

  credentials.password = hash;
  // move on to save the user.

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
    if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return res.status(401).json({ error: "You shall not pass!" });
      }

      //the user is logged in, respond with an array of all the users contained in the database
      if (user|| bcrypt.compareSync(credentials.password, user.password)){
        return res.send({array: db.username});
}});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening on port ${port}`));
