const express = require('express')
const route = express.Router()

route.get('/', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('there was an error logging out.')
            } else {
                res.send('Logged out.')
            }
        })
    }
})

module.exports = route;
