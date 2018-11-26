const express = require('express');
const bcrypt = require('bcryptjs');
const port = 3334;

const db = require('./config/dbConfig');
const middleware = require('./config/middleware')
const server = express();

middleware(server);

const sendError = (res, message = 'Server Error', code = 500)=>{
    return res.status(code).json({error:message})
}

server.get('/', (req,res) =>{
    res.send('<h1>Built by Ryan Clausen</h1>')
})

server.get('/api/users', async(req, res) =>{
    const users = await db('users');
    return res.status(200).json(users)
})

server.post('/api/register', async(req,res) =>{
    const credentials = req.body;
    if (!credentials.username || !credentials.password){
        return sendError(res, 'Username and password required!', 400)
    }
    const hash = await bcrypt.hash(credentials.password,14);
    credentials.password = hash;
    try{
    const id = await db('users').insert(credentials)
    return res.status(201).json(id)
}catch(err){
    sendError(res,err)
}
})

server.listen(port, ()=> console.log(`We hear you ${port}`))