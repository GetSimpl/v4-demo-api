import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import logger from 'loglevel'
import 'express-async-errors'
import detectPort from 'detect-port'
import getRouter from './routes'
import errorMiddleware from './utils/error-middleware'

async function startServer({port = process.env.SERVER_PORT} = {}) {
  port = port || (await detectPort(8888))
  const app = express()
  app.use(cors())
  app.use(bodyParser.json())

  const router = getRouter()
  app.use('/api', router)
  app.use(errorMiddleware)

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${server.address().port}`)
      const originalClose = server.close.bind(server)
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose)
        })
      }
      resolve(server)
    })
  })
}

export default startServer
