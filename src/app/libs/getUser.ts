import { AuthenticationError } from 'apollo-server-express'
import { jwtConfig } from '../../config'
import jwt from 'jsonwebtoken'
import { JwtPayload } from './tokenGenerate'

const getUser = async (token: string): Promise<JwtPayload> => {
  if (!token) {
    throw new AuthenticationError('need authorization header')
  }

  const data = await jwt.verify(token.replace('Bearer ', ''), jwtConfig.secret || '',(err,decoded)=>{
    if(err) {
      throw new AuthenticationError('invalid token!')
    }
    return decoded
  })
  return JSON.parse(JSON.stringify(data))
}

export default getUser
