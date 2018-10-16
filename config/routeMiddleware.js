function isRestricted(url){
    const code = '/restricted/';
    for(let i=0; i<code.length; i++){
        if(code.charAt(i)!==url.charAt(i)){
            return false;
        }
    }
    return true;
};

function protect(req, res, next){
    if(req.session && req.session.username){
        next();
    }else{
        res.status(401).json({message: 'Not authorized'})
    }
};

module.exports = {
    protected: function(req, res, next){
        protect(req, res, next);
    },

    restricted: function(req, res, next){
        if(isRestricted(req.url)){
            console.log('credentials cleared!')
            protect(req, res, next);
        }
        next();
    }
};