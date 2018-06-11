const express = require("express");
const server = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const port = process.env.PORT || 5000;

//Routes

//const registerController = require('./register/registerController')
const userController = require('./users/userController')
const loginController = require("./login/loginController");

//Gobal Middleware

server.use(helmet());
server.use(cors());
server.use(express.json());

//Endpoints

server.use("/api/login", loginController);
server.use('/api/user', userController)
//server.use('/api/register', registerController)

//Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/auth-i")
  .then(() =>
    console.log("\n*** API Connected to MongoDB at localhost/27017 ***\n")
  )
  .catch(err => console.log("\n*** ERROR Connecting to Database ***\n", err));

server.get("/", (req, res) => {
  res.status(200).json({ API: "is up and running" });
});

// server.post('/api/register' , (req,res) =>{
//     //const {username, password} = req.body

//})

server.listen(port, () => {
  console.log(`*** Server up and running on ${port} ***`);
});
