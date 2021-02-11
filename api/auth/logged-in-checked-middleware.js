module.exports = (req,res,next) => {
    if (req.session && req.session.user) {
        next()
    } else {
        res.status(403).json({message: 'You shall not pass!'});
    }
}