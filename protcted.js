const protected = (req, res, next)=> {
    if(req.session && req.session.userID){
        next();
    } else{
        res.status(401).json({message : "Log in required"})
    }
}

module.exports = protected;
