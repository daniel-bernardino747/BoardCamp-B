import express from 'express'
import { getCustomers } from '../controllers/customers.controller.js'

const routes = express.Router()

routes.get('/customers', getCustomers)

export default routes
