import express from 'express'

import * as controller from '../controllers/customers.controller.js'
import * as middle from '../middlewares/customers.middlewares.js'

const routes = express.Router()

routes.get('/customers', controller.getCustomers)

routes.get('/customers/:id', middle.validateUser, controller.getCustomer)

export default routes
