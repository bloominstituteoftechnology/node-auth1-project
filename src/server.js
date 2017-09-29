const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

// Completed TODO: implement routes
require('./routes')(server);

module.exports = { server };
