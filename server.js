import express from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'
import session from 'express-session'
import connectMongo from 'connect-mongo'

const MongoStore = connectMongo(session)

import mainRouter from './routes'
import { Server } from 'https'

const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('\n=== MongoDB Connected ===\n'))
  .catch(err => console.error(err.message, '\n', '\n=======\n', err.stack))

const sessionConfig = {
  secret: 'tacos and bells',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname',
  store: new MongoStore({
    url: process.env.MONGO_URIBASE + 'sessions',
    ttl: 60 * 10
  })
}
app.use(session(sessionConfig))

app.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.send(`welcome back ${req.session.username}`)
  } else {
    res.send('who are you? who, who?')
  }
})

app.use('/api', mainRouter)
const port = 8080
app.listen(port, () =>
  console.log(`\n=== server listening on http://localhost:${port} ===\n`)
)
