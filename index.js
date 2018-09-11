const express = require("express");
const helmet = require("helmet");
const dbhelpers = require("./dbhelpers/helpers");
const bcrypt = require('bcrypt');
const session = require('express-session');
const authcheck = require('./middleware/authcheck')

const server = express();


server.use(express.json());
server.use(helmet());

server.use(
  session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    secure: true, // only set cookies over https. Server will not send back a cookie over http.
    resave: false,
    saveUninitialized: false,
  })
);

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
    
    if (results.length === 0 || await !bcrypt.compareSync(req.body.password, results[0].password)) {
      return res.status(401).json({ error: 'You shall not pass!' });
    }
    else{
      req.session.name = results[0].user_name;
      return res.status(200).json({ status: 'Logged In' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});
server.get('/api/users',authcheck, async (req, res) => {
    const results = await dbhelpers.getUsers();
    return res.status(200).json(results);
});
server.use("/", (req, res) =>
  res
    .status(404)
    .json({ errorMessage: "You probably want to use a different endpoint" })
);

const port = 3300;
server.listen(port, function() {
  
});