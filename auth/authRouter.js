const express = require("express");
const router = express.Router();
const db = require("./authModel");
const bcrypt = require("bcryptjs");
// const restrict = require("./restrict");

router.post("/register", async (req, res, next) => {
  try {
    const data = { user_name: req.body.user_name, password: req.body.password };
    const newUser = await db.createUser(data);
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  
  try {
    const { user_name, password } = req.body;
    if (!user_name || !password) {
      return res.status(400).json({message:"credentials"});
    }
    const user = await db.findByName( user_name );
    console.log(user_name)
    if (!user) {
      return res.status(401).json({message:"invalid user"});
    }
    const pass = await bcrypt.compareSync(password, user.password);
    if (!pass) {
      return res.status(401).json({message:"password"});
    }
    res.status(200).json({ message: `welcome ${user.user_name}` });
  } catch (error) {
    next(error);
  }
  //sessions and cookies to come
});

module.exports = router;
