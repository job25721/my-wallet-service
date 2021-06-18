import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import userModel, { User } from '../models/user'
import jwtGenerator from '../libs/tokenGenerate'
import { Auth } from '../graphql/types/user'
import { AuthenticationError } from 'apollo-server-express'

const create = async (req: Request<any, any, User>, res: Response) => {
  try {
    const encrypt = bcrypt.hashSync(req.body.password, 10)
    const newUser = await userModel.create({ ...req.body, password: encrypt })
    return res.status(201).json(newUser)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const authorize = async (auth: Auth) => {
  const { usernameOrEmail, password } = auth
  const user = await userModel.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  })
  if (!user) {
    throw new AuthenticationError('No such user')
  }
  const compared = bcrypt.compareSync(password, user.password || '')
  if (!compared) {
    throw new AuthenticationError('Bad credentials')
  }
  const token = jwtGenerator({
    _id: user._id,
    username: user.username,
    firstName: user.firstName,
  })
  return token
}

export default {
  create,
  authorize,
}
