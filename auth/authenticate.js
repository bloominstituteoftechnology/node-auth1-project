//function authenticate(req, res, next) {
   // const { username, password } = req.headers;

    //if (username && password) {
       // Users.findBy({ username })
          //  .first()
            //.then(user => {
               // if (user && bcrypt.compareSync(password, user.password)) {
                //    next();
               // } else {
                 //   res.status(401).json({ message: "Invalid Credentials" });
              //  }
           // })
           // .catch(err => {
            //    res.status(500).json({ message: " Server Error" });
          //  });
   // } else {
      //  res.status(400).json({ message: "No credentials Provided" });
  //  }
//}

//module.exports = {
 //   authenticate
//};
module.exports = (req,res,next) =>{
    if (req.session && req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({message: "You shall not pass"})
    }
};
