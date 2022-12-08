import express from 'express'

import * as customer from '../controllers/customers.controller.js'
import * as middle from '../middlewares/customers.middlewares.js'

const routes = express.Router()

routes.get('/customers', customer.viewAll)

routes.get('/customers/:id', middle.validateExistenceCustomer, customer.viewOne)

export default routes
