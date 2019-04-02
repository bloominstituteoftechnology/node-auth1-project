const server = require('./api/server.js');

const port = process.env.PORT || 5000;

server.listen(port, function() {
  console.log(`\n=== API running on http://localhost:${port} ===\n`);
});