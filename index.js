require('dotenv').config();

const server = require('./api/server.js');

const port = process.env.PORT || 3000;
server.isten(port, () => console.log(`\n** Running on port ${port} **\n`))