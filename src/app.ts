import express, { Application } from 'express'
import morgan from 'morgan'
import apiRoutes from './app/routes'
import config from './config'

import cors from 'cors'
import database from './app/connections/mongoose'

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use(config.API_PREFIX, apiRoutes)
app.get('/healthz', (req, res) => res.json({ status: 'ok' }))

const server = async () => {
  await database.connect()
  app.listen(config.NODE_PORT, () =>
    console.log(`server started on ${config.NODE_PORT}`)
  )
}

server()
