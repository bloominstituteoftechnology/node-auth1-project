
module.exports = 
 function  (req, res, next) {
  if(req.session.name){
    
    res.locals.signedin = true;
    next();
  }
  else{
    return res.status(401).json({ error: 'You shall not pass!' });
  }
  }

