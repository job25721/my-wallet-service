import { Request, Response } from 'express'
import { User } from '../models/schemas/user'
import userModel from '../models/userModel'

const create = async (req: Request<any, any, User>, res: Response) => {
  try {
    const newUser = await userModel.create(req.body)
    return res.status(201).json(newUser)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

export default {
  create,
}
