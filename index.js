const server = require('./server.js');

const port = 4000;

server.listen(port, () => {
    console.log(`\n **Server Listening on ${port}** \n`)
})