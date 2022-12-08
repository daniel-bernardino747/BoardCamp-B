import express from 'express'

import * as customers from '../controllers/customers.controller.js'
import * as middle from '../middlewares/customers.middlewares.js'

const validationsToCreateCustomer = [
  middle.validateCustomerSchema,
  middle.validateUsedCPF,
]

const validationsToPutCustomer = [
  middle.validateExistenceCustomer,
  middle.validateCustomerSchema,
  middle.validateUsedCPF,
]

const routes = express.Router()

routes.get('/customers', customers.viewAll)

routes.post('/customers', validationsToCreateCustomer, customers.create)

routes.get(
  '/customers/:id',
  middle.validateExistenceCustomer,
  customers.viewOne
)

routes.put('/customers/:id', validationsToPutCustomer, customers.update)

export default routes
