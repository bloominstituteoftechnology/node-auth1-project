const bcrypt = require("bcryptjs")
const router = require("express").Router();

const Users = require("../users/users-model")

router.get("/", (req, res) => {
   res.status(200).send("Auth router working");
 });
 
 router.post("/register", (req, res) => {
   let user = req.body;
   // const hash = req.body.password ? bcrypt.hashSync(req.body.password, 8) : "";
   const hash = bcrypt.hashSync(user.password, 8);
 
   user.password = hash;
 
   Users.add(user)
     .then(saved => {
       res.status(201).json(saved);
     })
     .catch(error => {
       console.log("errors", error);
       res.status(500).json(error);
     });
 });
 
 router.post("/auth/login", (req, res) => {
   let { username, password } = req.body;
 
   // const hash
 
   Users.findBy({ username })
     .first()
     .then(user => {
       if (user && bcrypt.compareSync(password, user.password)) {
         res.status(200).json({ message: `Welcome ${user.username}!` });
       } else {
         res.status(401).json({ message: "Invalid Credentials" });
       }
     })
     .catch(error => {
       res.status(500).json(error);
     });
 });
 
 module.exports = router;