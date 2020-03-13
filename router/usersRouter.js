const db = require('../data/knexConfig');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express();

router.post('/register', async (req, res,next) => {
	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 14);
	credentials.password = hash;
	try {
		const addUser = await db('users').insert(req.body);
		res.json(addUser);
	} catch (err) {
		next()
	}
});


router.post('/login', async (req, res,next) => {
	const credentials = req.body;
	try {
		const user = await db('users').select('*').where('users.userName', credentials.userName).first();
		if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
			return res.status(401).json({ message: 'Invalid Credentials' });
		}
		else {
			return res.json({ message: `Welcome ${user.userName}` });
		}
	} catch (err) {
	next()
	}
});

router.get('/users',restrict(), async (req, res,next) => {
	try {
		const users = await db('users').select('users.id','users.userName');
		res.json(users);
	} catch (err) {
		next()
	}
});

//Helper functions

function findBy(filter){
    return db('users').select("id","username",'password')
    .where(filter)
}

// MiddleWare functions


function restrict(){
    const authError={
        message:"Invalid credentials"
    }
    return async(req,res,next)=>{
        try{
            const{username,password}=req.headers
            if(!username||!password){
                return res.status(401).json(authError)
            }
            const user=await findBy({username}).first()
            if(!user){
                return res.status(401).json(authError)
            }
            const passwordValid= await bcrypt.compare(password,user.password)
            if(!passwordValid){
                return res.status(401).json(authError)
            }
            next()

        }catch(err){
            next(err)
        }
    }
}


module.exports = router;
