const express = require('express');
const helmet = require('helmet');

const server = express();
server.use(express.json(), helmet());

// Sanity Check
server.get('/', (request, response) => {
    response.send(`IT'S ALIVE!!!`)
})


const port = 9999;
server.listen(port, console.log(`Server Active on Port ${port}`))