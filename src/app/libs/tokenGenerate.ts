import jwt from 'jsonwebtoken'
import config from '../../config'
export interface JwtPayload {
  _id: string
  username: string
  firstName: string
}

const jwtGenerator = (data: JwtPayload): string =>
  jwt.sign(data, config.jwtConfig.secret || '', {
    expiresIn: config.jwtConfig.expiry,
  })

export default jwtGenerator
