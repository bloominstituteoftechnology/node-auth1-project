const router = require("express").Router();
const bcrypt = require("bcryptjs");

// JWT
// const jwt = require("jsonwebtoken");
// const secrets = require("../api/secrets");

const Users = require("../users/users-model.js");

router.post("/register", async (req, res) => {
  let { username, password } = req.body;

  try {
    if (username && password) {
      const userFound = await Users.findBy({ username });
      if (userFound) {
        res.status(409).json({ error: "Username already exists." });
      } else {
        const hash = bcrypt.hashSync(password, 14);
        password = hash;
        const newUser = await Users.add({ username, password });
        res.status(201).json(newUser);
      }
    } else {
      res.status(400).json({ error: "Username and password are required." });
    }
  } catch (error) {
    res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;

  try {
    if (username && password) {
      const user = await Users.findBy({ username });
      if (user && bcrypt.compareSync(password, user.password)) {
        // req.session is added by express-session
        req.session.username = username;
        // const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${ username }. You are now logged in!`,
          // token
        });
      } else {
        res.status(401).json({ message: "Invalid credentials." });
      }
    } else {
      res.status(400).json({ error: "Username and password are required." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

router.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({ message: "Server error." });
      } else {
        res.status(200).json({ message: "Logged out successfully." });
      }
    });
  } else {
    res.status(400).json({ message: "You are not logged in!" });
  }
});

// JWT
// function generateToken(user) {
//   const payload = {
//     subject: user.id,
//     username: user.username,
//     roles: ["student", "ta"] // this would be a DB call
//   };
//   const options = {
//     expiresIn: "1d"
//   };

//   return jwt.sign(payload, secrets.jwtSecret, options);
// }

module.exports = router;
