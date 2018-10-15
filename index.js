const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

// log all API request types and their endpoint
function logger(req, res, next){
    console.log(`${req.method} to ${req.url}`);
    next();
}
server.use(logger);

// test if server is running
server.get('/', (req, res) => {
    res.send('It works yo');
})

const port = 9000;

server.listen(port, function() {
    console.log(`\n === WEB API LISTENING ON ${port} === \n`)
})