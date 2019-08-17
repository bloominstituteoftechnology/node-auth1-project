const server = require('./server.js');

const PORT = process.env.PORT || 5555;

server.listen(PORT, () => {
  console.log(`//================Server is running on ${PORT}... =================//`);
});