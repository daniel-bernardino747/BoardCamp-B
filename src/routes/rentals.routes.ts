import express from 'express'
import * as rentals from '../controllers/rentals.controller.js'

const routes = express.Router()

routes.get('/rentals', rentals.viewAll)

export default routes
