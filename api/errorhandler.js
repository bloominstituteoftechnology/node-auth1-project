module.exports =  (err, req, res, next) => {
    //whatever err that is passed in from  our routers will be handled below

    // showing err.apiCode is your return
    // err.apiMessage = your error message
    console.log('express error: ', err);
    if(err.apiCode >= 400) {
        res.status(err.apiCode).json({
            apiCode: err.apiCode, apiMessage: err.apiMessage, ...err
        })
    } else {
        next();
        //if code is less than 300, continue executing code in your router
    }
}