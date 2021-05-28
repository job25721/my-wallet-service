import { NextFunction, Request, Response } from 'express'
import mongoose from '../connections/mongoose'

const withSession = async (req: Request, res: Response, next: NextFunction) => {
  const client = await mongoose.connect()
  const session = await client.startSession()
  session.startTransaction()
  req.mongoSession = session
  return next()
}

export default withSession
