import express from 'express'
import * as rentals from '../controllers/rentals.controller.js'
import * as middle from '../middlewares/rentals.middlewares.js'

const collectDatasToRental = [
  middle.collectCustomerForRental,
  middle.collectGameForRental,
  middle.joinCustomerAndGameInRental,
]

const routes = express.Router()

routes.get('/rentals', collectDatasToRental, rentals.viewAll)

export default routes
