const app=require('./server')
const port =5000

app.listen(port,()=>{
    console.log(`server listen on port ${port}`)
})
