const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router({
  mergeParams: true
});

const Users = require('../dbModel/dbModel')
const {restricted} = require('../auth/restricted-middleware')

router.get('/', restricted, (req, res) => {
    Users.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err))

});

module.exports = router;