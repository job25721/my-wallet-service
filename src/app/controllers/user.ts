import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/schemas/user'
import userModel from '../models/userModel'
import jwtGenerator from '../libs/tokenGenerate'

const create = async (req: Request<any, any, User>, res: Response) => {
  try {
    if (!req.body.password) {
      throw new Error('')
    }
    const encrypt = bcrypt.hashSync(req.body.password, 10)
    const newUser = await userModel.create({ ...req.body, password: encrypt })
    return res.status(201).json(newUser)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

interface Auth {
  usernameOrEmail: string
  password: string
}
const authorize = async (req: Request<any, any, Auth>, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body
    const user = await userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    })
    if (!user) {
      throw new Error('no user')
    }
    const compared = bcrypt.compareSync(password, user.password || '')
    if (!compared) {
      return res.status(402).send('unauthorized')
    }
    const token = jwtGenerator({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
    })
    return res.status(200).json(token)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

export default {
  create,
  authorize,
}
