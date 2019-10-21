require('dotenv').config();
const server = require('./server.js');

const port = 4000;

server.listen(port, () => {
    console.log(`$$ server is running on port number ${port} $$`)

})