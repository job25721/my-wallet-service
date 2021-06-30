import mongoose from 'mongoose'
import { mongoConfig } from '../../config'

let client: typeof mongoose

const connect = async (): Promise<typeof mongoose> => {
  const options: mongoose.ConnectOptions = {
    user: mongoConfig.user,
    pass: mongoConfig.password,
    dbName: mongoConfig.db,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    ssl: mongoConfig.ssl,
    useFindAndModify: false,
  }
  if (!client) {
    try {
      client = await mongoose.connect(mongoConfig.mongoURL, options)
      console.log(`mongo connected on ${mongoConfig.mongoURL}`)
    } catch (error) {
      console.log(error)
    }
  }
  return client
}

const disconnect = () => mongoose.disconnect()

export default { connect, disconnect }
