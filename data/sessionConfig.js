module.exports = {
    secret: 'this-is-his-dog',
    name: 'mewithoutYou',
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}