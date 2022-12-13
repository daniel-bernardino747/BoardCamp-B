import express from 'express'
import * as rentals from '../api/controllers/rentals.controller.js'
import * as middle from '../api/middlewares/rentals.middlewares.js'

const routes = express.Router()

routes.get('/rentals', rentals.view)

routes.post('/rentals', middle.validateRentalSchema, rentals.create)

routes.delete('/rentals/:id', middle.validateToDeleteRental, rentals.remove)

routes.post('/rentals/:id/return', rentals.giveBack)

export default routes
