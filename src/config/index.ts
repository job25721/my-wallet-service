import * as dotenv from 'dotenv'
dotenv.config()
const NODE_PORT = process.env.PORT || 8080
const API_PREFIX = process.env.API_PREFIX || '/api'
const mongoConfig = {
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASS,
  db: process.env.MONGO_DB,
  mongoURL: process.env.MONGO_URL || 'mongo://localhost:27017',
  ssl: Boolean(process.env.MONGO_URL) || false,
}
export default {
  NODE_PORT,
  API_PREFIX,
  mongoConfig,
}
