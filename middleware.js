

module.exports.protected = (req, res, next) =>{
    if(req.session && req.session.username){
        next()
      }else {
        res.status(401).json({message:'Not Authorized!!!!'})
      }
}