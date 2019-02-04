// const express = require('express') ;
// const bcrypt = require('bcryptjs') ;
// const knex = require('knex')
// const config = require('../../knexfile')
// const DB = knex(config.development)

// const router = express.Router() ;

// router.post('/', (req, res) => {
// const { user, password } = req.body ;
// const hashedPW = bcrypt.hashSync(password, 8)
// req.body.password = hashedPW ;
//  DB('users')
//     .where('username', user.username)
//     .then((users) => {
//      if (users.length && user.userpassword === users[0].password) {
//       res
//        .json({info: "You're in."})
//      }
//      else {
//       res
//        .status(404)
//        .json({err: "Invalid user or password"})
//      }
//     })
//     .catch(() => {
     
//     })

// })