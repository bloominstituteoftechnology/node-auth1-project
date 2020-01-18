module.exports = () => {
    return (req, res, next) => {
        if(req.session || req.session.user) {
            next()
        } else {
            res.status(401).json({
                error: "Invalid credentials."
            })
        }
    }
}