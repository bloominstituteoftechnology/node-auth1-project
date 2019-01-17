const Joi = require('joi')
module.exports={
    user:{
        username: Joi.string().required(),
        password: Joi.string().min(6).required()
    }
}