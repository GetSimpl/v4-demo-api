import express from 'express'
import * as simplController from './simplPayController'

function getPayRoutes() {
  const router = express.Router()

  router.post('/eligible', simplController.isUserEligible)
  router.post('/charge', simplController.chargeUser)
  router.post('/refund', simplController.refundUser)

  return router
}

export default getPayRoutes
