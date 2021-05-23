import { Request, Response } from 'express'
import { User } from '../models/schemas/user'
import userModel from '../models/userModel'

const get = async (req: Request, res: Response) => {
  try {
    const users = await userModel.all()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json(error)
  }
}

const create = async (req: Request<any, any, User>, res: Response) => {
  try {
    const newUser = await userModel.create(req.body)
    return res.status(201).json(newUser)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const getUserByID = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await userModel.findByID(req.params.id)
    if (!user) {
      throw new Error('user not found')
    }
    return res.status(200).json(user)
  } catch (error) {
    if (error.message === 'user not found') {
      return res.status(404).send(error.message)
    }
    return res.status(500).json(error)
  }
}

export default {
  create,
  get,
  getUserByID,
}
