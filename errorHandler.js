module.exports =  (err, req, res, next) => {
    //if a function takes 4 params, its an error handling middleware function
    console.log('express error', err)
    if(err.apiCode >= 400) {
        res.status(err.apiCode).json({apiCode:errr.apiCode, apiMessage: err.apiMessage})
    } else {
        next()
    }
}