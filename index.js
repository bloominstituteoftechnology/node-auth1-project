const express = require("express");
const session = require("express-session");

const userRoutes = require("./routes/userRoutes");

const server = express();

//2 WAYS OF DOING THIS
// server.use(
//   session({
//       name: "monkey", // default is connect.sid
//       secret: "nobody tosses a dwarf!",
//       cookie: {
//         maxAge: 1 * 24 * 60 * 60 * 1000, // a day
//         secure: false // only set cookies over https. Server will not send back a cookie over http.
//       }, // 1 day in milliseconds
//       httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
//       resave: false,
//       saveUninitialized: false
//   })
// );
const sessionConfig = {
  secret: "im so bad at coding",
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  httpOnly: true,
  secure: true,
  resave: false,
  saveUninitialized: false
};
server.use(session(sessionConfig));

server.use(express.json());
server.use("/users", userRoutes);


server.get("/", (req, res) => {
  res.send("API running");
});

const port = 8000;
server.listen(port, function() {
  console.log(`\n=API on ${port}=\n`);
});
