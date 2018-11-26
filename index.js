const express = require('express');
const knex = require('knex');
 
const server = express();
server.use(express.json());

server.get('/', async (req, res) => {
    res.status(200).json({ message: 'Server is up'});
});



const port = 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));