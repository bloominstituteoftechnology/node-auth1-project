const express = require('express'),
    bodyParser = require('body-parser'),
    users = require('./api/users');

const app = express();

app
    .use(bodyParser.json())
    .use('/users', users);

app.listen(5000);