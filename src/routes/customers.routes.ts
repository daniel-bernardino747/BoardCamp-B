import express from 'express'

import * as customers from '../controllers/customers.controller.js'
import * as middle from '../middlewares/customers.middlewares.js'

const routes = express.Router()

routes.get('/customers', customers.viewAll)

routes.get(
  '/customers/:id',
  middle.validateExistenceCustomer,
  customers.ViewOne
)

export default routes
