const server = require('./server');

const port = 5678;
server.listen(port, () => console.log(`\nServer is alive and kicking on port ${port}\n`));