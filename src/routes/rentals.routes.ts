import express from 'express'
import * as rentals from '../api/controllers/rentals.controller.js'
import * as middle from '../api/middlewares/rentals.middlewares.js'

const collectDatasToRental = [
  middle.collectCustomerForRental,
  middle.collectGameForRental,
  middle.joinCustomerAndGameInRental,
]
const validationsToCreateRental = [
  middle.validateExistenceCustomerAndGame,
  middle.calculateOriginalPrice,
  middle.validateRentalSchema,
  middle.validateGameAvailability,
]
const stepsToGiveBackRental = [
  middle.validateReturnRent,
  middle.prepareReturnDateAndDelayFee,
]

const routes = express.Router()

routes.get('/rentals', collectDatasToRental, rentals.view)

routes.post('/rentals', validationsToCreateRental, rentals.create)

routes.delete('/rentals/:id', middle.validateToDeleteRental, rentals.remove)

routes.post('/rentals/:id/return', stepsToGiveBackRental, rentals.giveBack)

export default routes
