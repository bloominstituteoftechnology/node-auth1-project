const mongoose = require('mongoose');
const express = require('express');

const server = express();

server.use(express.json());

mongoose
  .connect('mongodb://localhost/AuthDB')
  .then(connect => console.log("\n connected to AuthDB"))
  .catch(err => console.log("error connecting to AuthDB", err))


server.get('/', (req, res) => {
  res.send({ msg: 'Test is successful. GET works' })
})

server.post("/api/register", (req, res) => {
    res.send("I think it POSTed the new user")
})
  




const port = 6060;
server.listen(port, () => { console.log(`Server is running on ${port}`); 
})