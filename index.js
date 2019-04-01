const server = require('./api/server.js');

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.listen(5000, () => console.log('Serevr is UP on port 5000'));
