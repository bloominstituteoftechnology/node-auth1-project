// Do NOT modify this file; make your changes in server.js.
const { server } = require('./server.js');
const PORT = 5000;

server.listen(PORT, () => {
  console.log('Server listening on port: ', PORT);
});
