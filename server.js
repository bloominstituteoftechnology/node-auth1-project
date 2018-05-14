import express from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'

import mainRouter from './routes'

const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(morgan('dev'))
app.use(helmet())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('\n=== MongoDB Connected ===\n'))
  .catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('love')
})

app.use('/api', mainRouter)

app.listen(8080, () => console.log('\n=== server listening on http://localhost:8080 ===\n'))