module.exports = (err, req, res, next) => {
    // err.apiCode = return code 
    // err.apiMessage = return message

    console.log('express error:', err);

    if (err.apiCode >= 400) {
        res.status(err.apiCode).json({ apiCode: err.apiCode, apiMessage: err.apiMessage, ...err })
    } else {
        next()
    }
}

/*
    we are creating a middleware function that receives

    remember if our middleware function takes four parameters
    then it is an error handling middleware function

    we are deciding that error.api code is our return code
    and error.api message is our return message code
    there maybe other information in that object 

    if error. api code is greater than or equal to 400
    then in my response we will set the status to whatever that code is (apiCode) err.apiCode
    and we will send back an object ({ apiCode: err.apiCode, apiMessage: err.apiMessage })
    then in addition to those two things we are including the rest of the error object (...err)

    if it is not greater than or equal to 400 
    else than go to the next piece of middleware

*/