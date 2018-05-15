import express from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'
import session from "express-session";
import connectMongo from 'connect-mongo'

const MongoStore = connectMongo(session)

import mainRouter from './routes'

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

const authenticate = (req, res, next) =>
  (req.session && req.session.username
    ? next()
    : res.status(401).send('Mithrandil looks down upon you'))

const sessionConfig = {
  secret: process.env.MONGO_SECRET,
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'ad',
  store: new MongoStore({
    url: process.env.MONGO_URIBASE + 'sessions',
    ttl: 60 * 10
  })
}

app.get('/', (req, res) => {
  res.send('love')
})

app.use('/api', mainRouter)
const port = 8080
app.listen(port, () =>
  console.log(`\n=== server listening on http://localhost:${port} ===\n`)
)
