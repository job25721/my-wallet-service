import express, { Application } from 'express'
import morgan from 'morgan'
import swagger from 'swagger-ui-express'
import cors from 'cors'
import { ClientSession } from 'mongoose'

import apiRoutes from './app/routes'
import { API_PREFIX, NODE_PORT, NODE_ENV } from './config'
import database from './app/connections/mongoose'
import { JwtPayload } from './app/libs/tokenGenerate'
import apidoc from './swagger-dev.json'
import apidocProduction from './swagger-prod.json'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
      mongoSession?: ClientSession
    }
  }
}

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(
  '/docs',
  swagger.serve,
  swagger.setup(
    NODE_ENV === 'dev'
      ? apidoc
      : NODE_ENV === 'production'
      ? apidocProduction
      : undefined
  )
)

app.use(API_PREFIX, apiRoutes)
app.get('/healthz', (req, res) => res.json({ status: 'ok' }))

const server = async () => {
  await database.connect()
  app.listen(NODE_PORT, () => console.log(`server started on ${NODE_PORT}`))
}

server()
