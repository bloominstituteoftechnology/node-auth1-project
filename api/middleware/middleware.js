const Users = require('../users/users-model');

function restricted(req, res, next){
    if(req.session && req.session.user){
        next();
    } else{
        res.status(401).json('unauthorized');
    }
}

function checkPayload(req, res, next){
    if(!req.body.username || !req.body.password){
        res.status(401).json('Username or Password missing');
    } else{
        next();
    }
}

async function checkUserInDb(req, res, next){
    try{
        const rows = await Users.findBy({username: req.body.username})
        if(!rows.length){
            next()
        } else{
            res.status(401).json('Username already exists')
        }
    } catch(error){
        res.status(500).json(`Server error: ${error}`)
    }
}

async function checkUserExists (req, res, next){
    try{
        const rows = await Users.findBy({username: req.body.username})
        if(rows.length){
            req.userData = rows[0]
            next();
        } else{
            res.status(401).json('Username or Password incorrect')
        }
    } catch(error){
        res.status(500).json(`Server error: ${error}`)
    }
}


module.exports ={
    restricted,
    checkPayload,
    checkUserInDb,
    checkUserExists
}