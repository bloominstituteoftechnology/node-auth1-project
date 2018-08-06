const express = require('express');

// const user = ('./users/User.js')

const server = express();

authen = (req, res, next) => {
    next();
}

server.use(express.json());

server.get('/', (req, res) => {
    res.send("Api Running")
})

const port = 8000;
server.listen(port, () => console.log(`\n=== API running on ${port} ===\n`)); 