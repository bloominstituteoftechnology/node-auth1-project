const express = require('express')

const server = express()

server.get('/', (req,res) => {
    res.send('hello from express')
})

server.listen(4000, () => {
    console.log('server running on 4000')
})