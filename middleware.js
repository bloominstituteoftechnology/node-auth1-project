//middleware verification function
module.exports = {
    checkSession: function(req, res, next){
        if(req.session && (req.session.userId || req.session.username)){
            next();
        }else{
            res.json({err: "You shall not pass!"})
        }
    }
}