import express from 'express'

import * as customers from '../api/controllers/customers.controller.js'
import * as middle from '../api/middlewares/customers.middlewares.js'

const routes = express.Router()

routes.get('/customers', customers.viewAll)

routes.post('/customers', middle.validateCustomerSchema, customers.create)

routes.get('/customers/:id', customers.viewOne)

routes.put('/customers/:id', middle.validateCustomerSchema, customers.update)

export default routes
