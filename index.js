const express = require('express');
const helmet = require('helmet');


const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req,res) => {
    res.send('I Am Alive!');
})

server.listen(3700, () => console.log('\n Party at part 3700 '))
