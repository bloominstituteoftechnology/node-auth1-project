const express = require('express')

const router = express.Router()
const helmet = require('helmet');
const cors = require('cors');
//npm install bcryptjs
const bcrypt = require('bcryptjs')


module.exports = router