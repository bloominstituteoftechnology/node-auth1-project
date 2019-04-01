const server = require('./server');

const port = 6500;

server.listen(port, () => {
  console.log(`\n *** Server running on http://localhost:${port} ***\n`)
});