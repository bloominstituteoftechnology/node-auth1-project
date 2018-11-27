// external imports
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session); // returns a curried function and uses the imported session, so needs to come after

//init db and server
const db = require("./database/dbConfig");
const server = express();

// configure session object to be called later in middleware for better readability of middleware

const sessionConfig = {
  name: "foobar banana", //literally a foobar banana, unrelated if possible, helps avoid attacks who target the default value
  secret: "*secret treasure found sound effect*",
  cookie: {
    maxAge: 1000 * 60 * 10, // session times out after 10 minutes
    secure: false // only set it over https if true: should be true for production
  },
  httpOnly: true, // no js can touch this cookie (such as extensions)
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    // can be abstracted in a config like sessionConfig also
    tablename: "sessions", //every prop is all-lowercase except for clearInterval
    sidfieldname: "sid", // foobar banana but stands for session id here
    knex: db,
    createtable: true, //automatically creates the table for us instead of having to implement migration
    clearInterval: 1000 * 60 * 60 // interval between clearing out timed-out rows in sessions table (otherwise you could end up with a table with thousands of rows over time)
  })
};

//necessary middleware
server.use(helmet());
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

//custome middleware (will be used globally) to restrict access if path starts with '/api/restricted'
function restrictMiddleware(req, res, next) {
  // if path contains '/api/restricted', no matter what follows, runs check for valid session and cookie info
  if (req.path.includes("/api/restricted")) {
    // verifies if user is logged in. if yes, points to next middleware (the endpoint, in this case)
    if (req.session && req.session.userId) {
      next();
    } else {
      // not logged in, kill request
      res.status(401).json({ message: "You shall not pass!" });
    }
  } else {
    // path doesn't contain '/api/restricted', so runs the next middleware(endpoint) as it's written
    next();
  }
}

//all server requests first pass through restrict middleware
server.use(restrictMiddleware);

// endpoints
// create new user (register)
server.post("/api/register", (req, res) => {
  // grab username and password from body
  const creds = req.body;
  //verify username and password was submitted
  if (!creds.username || !creds.password) {
    res.status(400).json({ message: "Submit both username and password" });
  } else {
    //verify username does not already exist (needs to be unique)
    db("users")
      .where({ username: creds.username })
      .first()
      .then(user => {
        //kill request if user already exists
        if (user) {
          res.status(422).json({ message: "That username is already taken." });
        } else {
          //generate hash
          const hash = bcrypt.hashSync(creds.password, 16);

          //override password with hash
          creds.password = hash;

          //save user to db, return new user's id
          db("users")
            .insert(creds)

            .then(id => {
              res.status(201).json(id);
            })
            .catch(err =>
              res
                .status(500)
                .json({ error: "Error while saving this user: ", user })
            );
        }
      });
  }
});

// authenticate user
server.post("/api/login", (req, res) => {
  const creds = req.body;
  if (!creds.username || !creds.password) {
    res
      .status(400)
      .json({ message: "Username and password required to login." });
  } else {
    db("users")
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          //after verifying user exists and pasword matches, attach userID field onto session to be checked against in protected endpoints
          req.session.userId = user.id;
          res.status(200).json({ message: "Login successful" });
        } else {
          res.status(401).json({ message: "No login for you!" });
        }
      })
      .catch(err =>
        res.status(500).json({ error: "Error during login attempt: ", err })
      );
  }
});

// get list of all users ONLY IF user is logged in
// MVP version (checks for session and valid cookie info userId inside code block)
server.get("/api/users", (req, res) => {
  // check for session && userId (created upon valid login)

  if (req.session && req.session.userId) {
    //user is currently logged in, so provide access to endpoint hit
    db("users")
      .select("id", "username")
      .orderBy("id")
      .then(users => res.status(200).json(users))
      .catch(err =>
        res
          .status(500)
          .json({ error: "Error occurred while retrieving users: ", err })
      );
  } else {
    //not logged in, bounce 'em!
    res.status(401).json({ message: "You shall not pass!" });
  }
});

// get list of all users ONLY if user is logged in
// stretch version (contains '/api/restricted/' in path name, so triggers a hit in restrictMiddleware)
server.get("/api/restricted/users", (req, res) => {
  // session & cookie check abstracted away because it is done in restrictMiddleware

  db("users")
    .select("id", "username")
    .orderBy("id")
    .then(users => res.status(200).json(users))
    .catch(err =>
      res
        .status(500)
        .json({ error: "Error occurred while retrieving users: ", err })
    );
});

// manual logout
server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("You can never leave *guitar solo*");
      } else {
        res.send("Later tater");
      }
    });
  } else {
    res.send("Need to log in to log out, bro");
  }
});

server.listen(5500, () => console.log("\nrunning on Port 5500\n"));
