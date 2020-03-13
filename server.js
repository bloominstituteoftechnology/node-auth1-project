const express=require('express')
const server=express()
const userRouter=require('./router/usersRouter')
server.use(express.json())
server.use('/api',userRouter)

server.use((err,req,res,next)=>{
    res.status(500).json({message:"Server Error"})
})


module.exports=server