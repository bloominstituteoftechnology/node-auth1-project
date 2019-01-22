const express = require('express');

const server = express();

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = server;