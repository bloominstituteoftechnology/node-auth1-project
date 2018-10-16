const express = require('express');
const session = require('express-session');
const userRoutes = require("./routes/userRoutes");





const server = express();

const sessionConfig = {
    secret: 'nobody.tosses.a.dwarf.!',
    name: 'monkey',
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      maxAge: 100 * 60 * 1,
  
    }
}

// endpoints here
server.use(session(sessionConfig));
server.use(express.json());


server.use("/users", userRoutes);

server.get("/", (req, res) => {
    res.send("it's alive");

});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
