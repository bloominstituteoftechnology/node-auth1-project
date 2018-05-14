import { Router } from 'express'

const mainRouter = Router({ mergeParams: true })

mainRouter.get('/', (req, res, ) => {
  res.send('connected to api')
})

export default mainRouter