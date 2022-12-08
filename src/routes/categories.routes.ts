import express from 'express'
import { getCategories } from '../controllers/categories.controller.js'

const routes = express.Router()

routes.get('/categories', getCategories)

export default routes
