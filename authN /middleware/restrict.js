const bcrypt = require('bcryptjs');
const user = require('../authnModel')


module.exports = (req, res, next) =>{
    const{username, password} = req.headers;

    user.findByUsername({username, password: bcrypt.hashSync(password, 9)})
        .then(id =>{
            if(user && bcrypt.compareSync(password, user.password))
            {
            next();
            }
         else {
            res.status(403).json({message: 'you shall not pass'});
        }
        })

        .catch(err =>{
            console.log(err);
            res.status(500) .json({message: 'cannot complete request'});
        });
};