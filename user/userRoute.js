const express = require('express');
const Users = require('./user-model');
const router = express.Router();
const restrict = require('../middleware/restrict');

router.get('/', restrict(), async(req, res, next) => {
   try{
    res.json(await Users.find())
   }catch(err) {
       next(err);
   }
})

module.exports = router;