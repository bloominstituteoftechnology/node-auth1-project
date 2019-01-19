module.exports = {
    protect
};

function protect(req, res, next){
    if(req.session && req.session.userId){
        next();
    }
    else{
        res.status(400).json({errorMessage: 'Access Denied'});
    }
}