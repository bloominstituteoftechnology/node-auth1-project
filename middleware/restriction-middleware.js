const bcrypt = require('bcryptjs')
const Users = require('../models/users-model.js')


module.exports = (req,res,next) => {
    const { username, password } = req.headers

    if( username && password){
        Users.searchBy({username})
            .then(userInDB =>{
                if(userInDB && bcrypt.compareSync(password, userInDB.password)){
                    next();
                } 
                else{
                    res.status(401).json({message: `Sorry, invalid credentials. You shall not pass!`})
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({error: `error validating credentials. Try again!`})
            })
    } 
    else{
        res.status(401).json({message: `provide username & password`})
    }
}