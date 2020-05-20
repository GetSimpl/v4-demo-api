import logger from 'loglevel'
import startServer from './start'

const logLevel = process.env.LOG_LEVEL || 'info'

logger.setLevel(logLevel)

startServer({port: 8080})
