//server
const server = require('./server.js');
//server port
const port = process.env.PORT || 7900;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
