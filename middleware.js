const checkRegisterInfo = (req, res, next) =>{
    if(req.body.username && req.body.password) {
        next()
    }else{
        res.status(404).json({message: "Please enter a valid username and password"})
    }
}

const restricted = (req, res, next) =>{
    if(req.session && req.session.username){
        next()
    } else {
        res.status(401).json({message: "Please login!"})
    }
}

module.exports = {checkRegisterInfo, restricted}