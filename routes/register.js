import { Router } from 'express'
import User from '../models/users'
const registerRouter = Router({ mergeParams: true })

registerRouter.post('/', (req, res, next) => {
  new User(req.body)
    .save()
    .then(({ _doc: { password, ...user } }) => res.status(201).json(user))
    .catch(({ message }) => res
      .status(500)
      .json({ message }))
})
export default registerRouter
