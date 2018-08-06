const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const users = require("./data/helpers/userHelper");

const server = express();

//middleware
server.use(express.json());
server.use(helmet());
server.use(cors({}));

//routing/endpoints
server.post("/api/register", (req, res) => {
  const project = req.body;
  projects
    .insert(project)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      return error;
    });
});

server.post("/api/login", (req, res) => {
  const project = req.body;
  projects
    .insert(project)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      return error;
    });
});

server.get("/api/users", (req, res) => {
  projects
    .get()
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      return error;
    });
});

server.listen(8000, () => console.log("\n=== API running... ===\n"));
