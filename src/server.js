const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

require('./user');
const routes = require('./routes');
const handler = require('./handlers');

const server = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: false,
  saveUninitialized: false,
}));
server.use('/', routes);
server.use(handler.notFound);
server.use(handler.validationErrors);
if (server.get('env') === 'development') server.use(handler.handleErrors);

module.exports = { server };
