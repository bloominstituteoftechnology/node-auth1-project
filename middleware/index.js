'use strict'

exports.convertUsernameToLowecase = (req, res, next) => {
    req.body.username = req.body.username.toLoweCase()
    next()
}