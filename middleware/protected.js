module.exports = (req, res, next) => {
    req.session && req.session.userId 
        ? next() 
        : res.status(401).json({message: 'you shall not pass!'})
}