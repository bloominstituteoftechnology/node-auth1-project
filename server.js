const express = require('express');

const server = express();
const port = 4000;


server.use('/', (req, res) => res.send('It\'s Working !!'));

server.listen(port, () => console.log(`Server listening on port ${port}`));