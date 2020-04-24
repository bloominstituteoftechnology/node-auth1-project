
module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res
      .status(401)
      .json("Looks like you need to login first to access this information");
  }
};
// module.exports = (req, res, next) => {
//     const {username, password} = req.headers

//     if(!username && !password){
//         console.log(username, password)
//         res.status(401).json({message: 'Invalid login credentials'})
//     }else {
//         Users.findBy({username})
//             .first()
//             .then(user => {
//                 if(user && bcrypt.compareSync(password, user.password)){
//                     req.sessions.users = username
//                     res.status(200).json({ message: "welcome" `${username}`})
//                 }
//                 else{
//                     res.status(401).json({ messege: "Invalid Credentials" })
//                 }
//             })
//             .catch(err => {
//                 res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
//             })
//     }
// }