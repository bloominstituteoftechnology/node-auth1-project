const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const server = express();

const port = 4000;

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => res.send("Our server lives!"));

// Hash Password
server.route("/api/register").post((req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  db("users")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catch(err => res.status(500).json(err));
});

server.listen(port, () => console.log(`\n Server listening on ${port} \n`));
