const server = require('./server.js')
const express = require('express');


const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');









const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));