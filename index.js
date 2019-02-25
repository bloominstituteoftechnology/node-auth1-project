const express = require("express");
const db = require("./data/user-model.js");
const bcrypt = require('bcryptjs')

const server = express();

server.use(express.json());

server.post("/api/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;
  db.add(user)
    .then(add => {
      res.status(201).json(add);
    })
    .catch(({ code, message }) => {
      res.status(code).json({ message });
    });
});

server.post("/api/login", (req, res) => {});

server.get("/api/users", restricted, (req, res) => {
  db.get()
    .then(found => {
      res.status(200).json(found);
    })
    .catch(({ code, message }) => {
      res.status(code).json({ message });
    });
});

function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    db.findBy({ username })
      .first()
      .then(user => {
        // check that passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
}
  
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));