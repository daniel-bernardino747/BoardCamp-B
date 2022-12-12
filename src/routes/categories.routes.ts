import express from 'express'
import * as categories from '../api/controllers/categories.controller.js'
import * as middle from '../api/middlewares/categories.middlewares.js'

const validationsToCreateCategory = [
  middle.validTypography,
  middle.validateExistenceInDatabase,
]

const routes = express.Router()

routes.get('/categories', categories.viewAll)

routes.post('/categories', validationsToCreateCategory, categories.create)

export default routes
