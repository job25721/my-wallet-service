import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config'

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization
    if (!authorization) {
      return res.status(402).send('need authorization header')
    }

    const token = authorization.replace('Bearer ', '')
    const data = jwt.verify(token, config.jwtConfig.secret || '')
    req.user = JSON.parse(JSON.stringify(data))
    return next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send('unauthorized')
    }
    return res.status(500).send(error.message)
  }
}
