const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model");

//POST /api/auth/register
router.post("/register", (req, res) => {
  //get credentials from body, can be the form with username and password
  const { username, password } = req.body;
  //make a hash by using BCRYPT, hash takes raw password and number of rounds ,
  //10 is recommended, it is multipled by 2 so 2 to the power of 10 2^10
  const hashPassword = bcrypt.hashSync(password, 10);

  Users.add({
    username: username,
    password: hashPassword, // add the hashpassword to req.bod.password
  })
    .then((newPost) => {
      console.log(newPost, "newpost");
      newPost
        ? res.status(201).json(newPost)
        : res.status(404).json({ cant_post_user: "cant post user" });
    })
    .catch((err) => {
      console.log(err, "err");
      res.json({ data: "error" });
    });
});

//POST /api/auth/login
router.post("/login", (req, res) => {
  //get the credentials from the body, it's also
  //in the DB as {id: 1, username: "", password: ""} as an example
  //whatever you have in your table is what you request from the body
  const { username, password } = req.body;

  //now we check credentials of username and password using bcrypt,
  //we will get the hash from the db USERS TABLE
  Users.findBy({ username: username })
    .first()
    .then((user) => {
      console.log(user, "user in login");
      //we are now finding by the 1st index in the array of users, .FIRST()
      //makes this happen since we are only filtering to get one object
      //from the list of users
      //NOW COMPARE if the username in DB is matching to the password you
      //created on register, if so, we now have a session for this user login
      if (user && bcrypt.compareSync(password, user.password)) {
        //save the user to the session
        req.session.user = user;
        console.log(req.session, "req session in login for user");
        //we now send the cookie session and create one by sending to req.session
        res
          .status(200)
          .json({ message: `Welcome, ${user.username}, have the cookie` });
      } else {
        ///if we get here, there is no user with such username name
        res
          .status(404)
          .json({ message: "no access, invalid login credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json({ err: "500 error in loging, what happened?" });
    });
});

//GET LOGOUT /api/auth/logout
//use this to logout out of the api
router.get("/logout", (req, res) => {
  console.log("logging out endpoint");
  if (req.session) {
    req.session.destroy((err) => {
      err
        ? res.json({ message: "you cant logout yet" })
        : res.json({ message: "logged out" });
    });
  } else {
    res.json({ message: "this user doesn't even exist at all" });
  }
});

module.exports = router;
