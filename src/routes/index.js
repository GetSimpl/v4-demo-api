import express from 'express'
import {authMiddleware} from '../utils/auth'
import getAuthRouter from './auth'
import getPayRouter from './payments'

function getRouter() {
  const router = express.Router()
  router.use('/auth', getAuthRouter())
  router.use('/payments', authMiddleware, getPayRouter())
  return router
}
export default getRouter
