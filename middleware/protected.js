function protected(req,res,next){
  console.log(req.session)
  if(req.session && req.session.userid){
    next(); 
  } else {
    res.status(401).json({message: "You shall not pass protected!"})
  }
}

module.exports = protected; 