const express=require('express');
const server=express();
const knex=require('knex');
const cors=require('cors');
const bcrypt=require('bcryptjs')
const session=require('express-session')
const dbConfig=require('./knexfile.js');
const dbr=require('./db/modelUser.js');
const db=knex(dbConfig.development);
const PORT=process.env.PORT || 8000;


server.use(express.json());
server.use(cors());
server.use(session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  }));


server.post('/api/register', (req, res) => {
    const creds=req.body;
    const hash=bcrypt.hashSync(creds.hashedPassword, 14);
    creds.hashedPassword=hash;
    dbr.registerUser(creds).then(id=>res.status(201).json(id)).catch(err=>res.status(500).json(err))
   //grab username and password from body
    //generate the hash from the user's password
    //override the user.password with the hash
   //save the user to the database

});

server.post('/api/login', (req, res) => {
    const creds=req.body;
    dbr.getUser(creds.userName).then(user=>{
if(user && bcrypt.compareSync(creds.hashedPassword, user.hashedPassword)){
    req.session.userName=user.userName;
    console.log(req.session);
    
    res.status(200).json({message:'welcome friend, enter'})
    //passwords match, can log in
}else{
    //either username is not found or password is wrong
    res.status(401).json({message:'you shall not pass'})
}}).catch(err=>res.json(err))
});

server.get('/api/users', (req,res) =>{
    if(req.session && req.session.userName){
        dbr.getUsers().then(users=>res.json(users).status(201)).catch(err=>res.json(err))
    }else{res.status(400).json({message:'access denied'})}
})

server.post('/api/logout',(req,res)=>{
    req.session.destroy(err=>{});
    if(err){res.status(500).json({message:"failed to log out"})}else{res.send('logout successful!')}
})







server.listen(PORT, () => console.log(`API running on port ${PORT}`));