import * as dotenv from 'dotenv'
dotenv.config()
export const NODE_PORT = process.env.PORT || 8080
export const API_PREFIX = process.env.API_PREFIX || '/api'
export const NODE_ENV = process.env.NODE_ENV || 'dev'
export const mongoConfig = {
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASS,
  db: process.env.MONGO_DB,
  mongoURL: process.env.MONGO_URL || 'mongo://localhost:27017',
  ssl: Boolean(process.env.MONGO_URL) || false,
}
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiry: process.env.JWT_EXPIRY,
}
