const express = require("express");
const bcrypt = require("bcryptjs");
const port = 3334;

const db = require("./config/dbConfig");
const middleware = require("./config/middleware");
const server = express();

middleware(server);

const sendError = (res, message = "Server Error", code = 500) => {
  return res.status(code).json({ error: message });
};

server.get("/", (req, res) => {
  res.send("<h1>Built by Ryan Clausen</h1>");
});

server.get("/api/users", async (req, res) => {
  const users = await db("users");
  return res.status(200).json(users);
});

server.post("/api/register", async (req, res) => {
  const credentials = req.body;
  if (!credentials.username || !credentials.password) {
    return sendError(res, "Username and password required!", 400);
  }
  const hash = await bcrypt.hash(credentials.password, 14);
  credentials.password = hash;
  try {
    const id = await db("users").insert(credentials);
    return res.status(201).json(id);
  } catch (err) {
    sendError(res, err);
  }
});

server.post("/api/login", async (req, res) => {
  const credentials = req.body;
  if (!credentials.username || !credentials.password) {
    return sendError(res, "Username and password required!", 400);
  }
  try {
    const user = await db("users")
      .where({ username: credentials.username })
      .first();
    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      req.session.userId = await user.id;
      return res.status(200).json({ message: "You did good" });
    } else {
      return sendError(res, "get outta here", 401);
    }
  } catch (err) {
    return sendError(res);
  }
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.send("there is no escape");
      } else {
        return res.send("later dude");
      }
    });
  }else{
    return res.send('no session')
  }
});

server.get("/api/restricted", (req, res) => {
  res.json("secrets are here");
});

server.get("/api/restricted/:x", (req, res) => {
  const { x } = req.params;
  res.json(x);
});

server.listen(port, () => console.log(`We hear you ${port}`));
