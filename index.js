const express = require("express");
const userRouter = require("./data/routers/userInfoRouters.js");
const cors = require("cors");

const server = express();
const port = 7777;
// const session = require("express-session");
// server.use(
//   session({
//     name: "notsession",
//     secret: "not a gnelf not a gnoblin",
//     cookie: {
//       maxAge: 1 * 24 * 60 * 60 * 1000,
//       secure: false
//     },
//     httpOnly: true,
//     resave: false,
//     saveUninitialized: false
//   })
// );

server.use(express.json());
server.use(cors());

server.use("/api", userRouter);

server.listen(port, err => {
  if (err) console.log(err);
  console.log(`Server Running on port: ${port}`);
});
