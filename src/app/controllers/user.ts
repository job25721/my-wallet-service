import bcrypt from 'bcrypt'
import { AuthenticationError, ApolloError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { Auth, User } from '../graphql/types/user'
import userModel, { UserDoc } from '../models/user'
import jwtGenerator, { JwtPayload } from '../libs/tokenGenerate'
import { jwtConfig } from '../../config'

const create = async (user: User) => {
  const encrypt = bcrypt.hashSync(user.password, 10)
  return userModel.create({ ...user, password: encrypt })
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

const getUser = async (token: string): Promise<UserDoc> => {
  if (!token) {
    throw new AuthenticationError('need authorization header')
  }

  const data = await jwt.verify(
    token.replace('Bearer ', ''),
    jwtConfig.secret || '',
    (err, decoded) => {
      if (err) {
        throw new AuthenticationError('invalid token!')
      }
      return decoded
    }
  )
  const parsedUser: JwtPayload = JSON.parse(JSON.stringify(data))
  const foundUser = await userModel.findById(parsedUser._id)
  if (!foundUser) {
    throw new ApolloError('no user in dadabase')
  }
  return foundUser
}

export default {
  create,
  authorize,
  getUser,
}
