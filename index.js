require('dotenv').config();

const server = require('./api/server.js')

const port = 4448

server.listen(port, () => {
    console.log(`listening on port: ${port}`)
})