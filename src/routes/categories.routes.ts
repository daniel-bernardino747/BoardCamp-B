import express from 'express'
import * as categories from '../controllers/categories.controller.js'
import * as middle from '../middlewares/categories.middlewares.js'

const validationsToCreateCategory = [
  middle.validTypography,
  middle.validateExistenceInDatabase,
]

const routes = express.Router()

routes.get('/categories', categories.viewAll)

routes.post('/categories', validationsToCreateCategory, categories.create)

export default routes
