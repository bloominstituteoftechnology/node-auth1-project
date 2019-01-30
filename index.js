const express = require('express')
const cors = require('cors')

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send(`I'm alive!`)
});

server.listen(2525, () => console.log(`I'm alive!`))