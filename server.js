import express from 'express'
import mongoose, { mongo } from 'mongoose'

const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('\n=== MongoDB Connected ===\n'))
  .catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('love')
})

app.listen(8080, () => console.log('\n=== server listening on http://localhost:8080 ===\n'))