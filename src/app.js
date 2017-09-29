// Do NOT modify this file; make your changes in server.js.
const { server } = require('./server.js');
const mongoose = require('mongoose');

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Auth project started @ port ${PORT}`);
  mongoose.Promise = Promise;
  mongoose.connect('mongodb://student:student@ds147544.mlab.com:47544/lambda-projects', { useMongoClient: true }, (error) => {
    if (!error) console.log('MongoDB connected');
    else console.log('Error connecting MongoDB:', error);
  });
});
