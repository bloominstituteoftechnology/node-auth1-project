const express = require('express') ;
const loginDB = require('../helpers/loginDB')
const bcrypt = require('bcryptjs') ;
const router = express.router() ;

router.post('/', (req, res) => {
 const user, password = req.body ;
 const hashedPW = bcrypt.hashSync(password, 8)
 req.body.password = hashedPW ;

 
})