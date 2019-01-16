const express = require('express');
const cors = require('cors');
const server = express();

const PORT = process.env.PORT || 3500;
server.use(
  express.json(),
  cors
)


server.listen(PORT, () => {
  console.log(`<==== running server on port ${PORT} ===>`)
})