import mongoose from 'mongoose'
import config from '../../config'

let client: any

const connect = async () => {
  const options: mongoose.ConnectOptions = {
    user: config.mongoConfig.user,
    pass: config.mongoConfig.password,
    dbName: config.mongoConfig.db,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    ssl: config.mongoConfig.ssl,
  }
  if (!client) {
    try {
      client = await mongoose.connect(config.mongoConfig.mongoURL, options)
      console.log(`mongo connected on ${config.mongoConfig.mongoURL}`)
    } catch (error) {
      console.log(error)
    }
  }
  return client
}

const disconnect = () => mongoose.disconnect()

export default { connect, disconnect }
