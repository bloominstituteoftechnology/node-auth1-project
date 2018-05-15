import { Router } from 'express'
import User from '../models/users'
const registerRouter = Router({ mergeParams: true })

registerRouter.post('/', (req, res, next) => {
  console.log(req.body)
  new User(req.body)
    .save()
    .then(user => res.status(201).json(user))
    .catch(err => console.error(err))
})
export default registerRouter
