const mongoose = require('mongoose');
const express = require('express');

const server = express();
server.use(express.json());

mongoose
  .connect('mongodb://localhost/AuthDB')
  .then(connect => console.log("\n connected to AuthDB"))
  .catch(err => console.log("error connecting to AuthDB", err))




const port = 6060;
server.listen(port, () => { console.log(`Server is running on ${port}`); 
})