//* 🎇 Validation Middleware - validates the cookie for the user router 🎇 *// 
module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        next(); 
    } else {
        res.status(401).json({ message: "Session has expired, please log back in" }); 
    }
}