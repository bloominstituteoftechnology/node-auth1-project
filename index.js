
require('dotenv').config();
const server = require('./server')

const PORT = process.env.PORT || 4225;

server.listen(PORT, () => {
    console.log(`\n listening in port ${PORT}`.america)
})