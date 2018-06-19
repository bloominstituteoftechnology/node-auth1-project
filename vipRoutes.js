const express = require('express')

const router = express.Router();



router.route('/test')
    .get((req, res) => {
        User.find()
            .then(users => {
                res.send(users)
            })
            .catch(err => {
                res.send({err: "err"})
            })
    })

module.exports = router;