const express = require("express"),
  port = process.env.PORT || 5000,
  cors = require("cors"),
  Users = require("./data/db-helpers"),
  bcrypt = require("bcryptjs"),
  server = express();

server.use(express.json());
server.use(cors());

server.get("/api", (req, res) => {
  res.status(200).send("<h1>Welcome to the Authentication API</h1>");
});

server.post("/api/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 5);
  user.password = hash;

  Users.insert(user)
    .then(newUser => {
      res.status(200).json({
        message: `Successfully created account for ${user.username}`,
        id: newUser[0]
      });
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Unable to access database" });
    });
});

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  Users.findByUser(username)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          message: "Welcome!",
          id: user.id,
          userName: user.username
        });
      } else {
        res
          .stratus(404)
          .json({ errorMessage: "Unable to login with those credentials" });
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Unable to access database" });
    });
});

server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Unable to access database" });
    });
});
server.listen(port, () => {
  console.log("Server listening on port:" + port);
});
