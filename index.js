const server = require('./api/server.js');

const port = process.env.PORT || 5200;
server.listen(port, () => console.log('server on port 5.2k'));