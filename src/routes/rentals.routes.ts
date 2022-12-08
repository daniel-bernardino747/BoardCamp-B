import express from 'express'
import { getRentals } from '../controllers/rentals.controller.js'

const routes = express.Router()

routes.get('/rentals', getRentals)

export default routes
