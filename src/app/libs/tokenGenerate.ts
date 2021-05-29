import jwt from 'jsonwebtoken'
import { jwtConfig } from '../../config'
export interface JwtPayload {
  _id: string
  username: string
  firstName: string
}

const jwtGenerator = (data: JwtPayload): string =>
  jwt.sign(data, jwtConfig.secret || '', {
    expiresIn: jwtConfig.expiry,
  })

export default jwtGenerator
