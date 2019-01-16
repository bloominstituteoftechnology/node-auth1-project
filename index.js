//create express server
const express = require('express');
const server = express();

//built-in middleware
server.use(express.json());
const cors = require('cors');
server.use(cors());

//endpoint to test server
server.get('/', (req,res) =>{
    res.json("Success");
})

//listener
const PORT = 4000;
server.listen(PORT, ()=>{
    console.log(`Server up and running on port ${PORT}`);
})