
module.exports = (req, res, next) => {
    console.log('middleware reached')
    if(req.session && req.session.user){
        next();
    } else {
        res.status(401).json({ System_Message: 'Incorect username or password.'});
    }
}