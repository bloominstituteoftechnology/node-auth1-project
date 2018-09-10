
const express = require("express");
const cors = require("cors");


const server = express();

server.use(express.json());
server.use(cors());


 server.get("/", (req, res) => {
  res.send("Test");
});
 server.listen(3000, () => console.log("\nrunning on port 3000\n"));