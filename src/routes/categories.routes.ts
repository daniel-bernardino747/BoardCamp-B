import express from 'express'
import * as controller from '../controllers/categories.controller.js'
import * as middle from '../middlewares/categories.middlewares.js'

const routes = express.Router()

routes.get('/categories', controller.getCategories)

routes.post('/categories', middle.validateNewCategory, controller.postCategory)

export default routes
