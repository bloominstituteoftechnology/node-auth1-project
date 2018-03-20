// Do NOT modify this file; make your changes in server.js.
const { server } = require('./server.js');

server.listen(3000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('server running on 3000');
});
