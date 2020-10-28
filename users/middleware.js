function restrict(){
    return async (req,res,next) => {
        if (!req.session || !req.session.user){
            return res.status(401).json({message: "invalid creds"})
        }
        next()
    }
}




module.exports = {
    restrict
}