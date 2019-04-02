const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./users/users-model.js');

router.post("/register", async (req, res) => {
  let credentials = req.body;

  try {
    if (credentials.username && credentials.password) {
      const hash = bcrypt.hashSync(credentials.password, 14);
      credentials.password = hash;

      const newUser = await Users.add(credentials);
      res.status(201).json(credentials);
    } else {
      res.status(400).json({ error: "Please include a username and password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Username already exists or failed to connect to router"});
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;

  try {
    if (username && password) {
      const user = await Users.findBy({ username: username });
      if (user && bcrypt.compareSync(password, user.password)) {
        // req.session is added by express-session
        req.session.user = user;
        
        res.status(200).json({ message: `Welcome ${user.username}` });
      } else {
        res.status(401).jason({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ error: "Please include a username and password" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// This endpoint needs to be restricted unless user provides
// the right credentials in the headers
router.get("/api/users", restricted, async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;