//middleware verification function
module.exports = {
    checkSession: function(req, res, next){
        if(req.session && req.session.userId){
            next();
        }else{
            res.json({err: "You shall not pass!"})
        }
    }
}