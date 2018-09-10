const express = require("express");
const helmet = require("helmet");
const dbhelpers = require("./dbhelpers/helpers");
const bcrypt = require('bcrypt');

const server = express();


server.use(express.json());
server.use(helmet());

server.post("/api/register", async (req, res) => {
  if (!req.body.user_name ||!req.body.password  ) {
    res.status(400).json({ errorMessage: "Invalid body" });
  }
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 14);
    
    const results = await dbhelpers.addUser(req.body);
    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json(err);
  }
});

server.post("/api/login", async (req, res) => {
  if (!req.body.user_name ) {
    res.status(400).json({ errorMessage: "Invalid body" });
  }
  try{
    const results = await dbhelpers.findUser(req.body);
    console.log(results)
    if (results.length === 0 || await !bcrypt.compareSync(req.body.password, results[0].password)) {
      return res.status(401).json({ error: 'Incorrect credentials' });
    }
    else{
      return res.status(200).json({ status: 'Logged In' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

server.use("/", (req, res) =>
  res
    .status(404)
    .json({ errorMessage: "You probably want to use a different endpoint" })
);

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});