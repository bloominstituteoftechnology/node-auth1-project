module.exports = (err, req, res, next) => {
    // err.apiCode = return
    // err.apiMessage = return message
    console.log('express error: ', err);
    if (err.apiCode >= 400) {
        res.status(err.apiCode).json({
            apiCode: err.apiCode, apiMessage: err.apiMessage, ...err
        });
    } else {
        next();
    }
}