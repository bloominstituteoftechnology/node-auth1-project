// const bcrypt = require("bcryptjs")
const Users = require("./user-model")


function restrict(){
    return async (req,res,next)=>{
        const autherr ={
            message: "invalid entry"
        }
        try{
           if(!req.sessions || !req.sessions.user)
           return res.status(401).json(autherr)
           next()
        }catch(err){
            next(err)
        }
    }
}

module.exports={
    restrict,
}