import express, { Application } from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { ClientSession } from 'mongoose'
import http from 'http'
import { NODE_PORT } from './config'
import { JwtPayload } from './app/libs/tokenGenerate'
import database from './app/connections/mongoose'
import schema from './app/graphql/schema'

const app: Application = express()

app.use(cors())
app.use(express.json())

app.get('/healthz', (req, res) => res.json({ status: 'ok' }))

const graphqlServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const client = await database.connect()
    const session = await client.startSession()
    session.startTransaction()
    const token = req.headers.authorization || ''
    return { token, session }
  },
})

graphqlServer.applyMiddleware({ app, path: '/api/graphql' })
const server = http.createServer(app)

database
  .connect()
  .then(() => {
    server.listen(NODE_PORT, () =>
      console.log(`server started on ${NODE_PORT}`)
    )
  })
  .catch((err) => console.error(err))
