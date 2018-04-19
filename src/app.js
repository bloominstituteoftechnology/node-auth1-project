// Do NOT modify this file; make your changes in server.js.
const { server } = require('./server.js');
const mongoose = require('mongoose');
mongoose
  .connect('mongodb://127.0.0.1/auth', { useMongoClient: true })
  .then(() => {
    console.log('connected to the mongo database');
    server.listen(5000);
  })
  .catch((err) => console.log(err));
