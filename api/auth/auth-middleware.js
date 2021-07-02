const users = require('./../users/users-model.js')
const bcrypt = require('bcryptjs');


/*[x]
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
const restricted = () => (req, res, next) => {
  if(req.session && req.session.user){
    next();
  } else {
    res.status(401)
  }
}




/*[x]
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }

*/
function checkUsernameExists() {
  const user = req.body;
  if (user && bcrypt.compareSync(username, user.username)) {
    res.status(200).json({ message: `Welcome ${user.username}!` });
  } else {
    res.status(401).json({ message: 'Invalid Credentials' });
  }
}






/*[x]
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameFree() {
  const creds = req.body;
    const returnObject = {
      user_id: user_id,
      username: username
    }
      if(!creds.username || !bcrypt.compareSync(creds.username, users.username)){
        return res.status(401).json({message: "Username Taken"})
      } else {
        return returnObject;
        next()
      }
}





/*[x]
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {
  let user = req.body
  if(!user.password || user.password <= 3){
    res.status(422).json({message: "Password must be longer than 3 chars"})
  } else {
    next()
  }
}

//[x] Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
};