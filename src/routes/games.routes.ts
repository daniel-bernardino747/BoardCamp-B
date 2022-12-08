import express from 'express'
import * as games from '../controllers/games.controller.js'
import * as middle from '../middlewares/games.middlewares.js'

const validationsToCreate = [
  middle.validateExistenceInDatabase,
  middle.validateGameSchema,
]

const routes = express.Router()

routes.get('/games', games.viewAll)

routes.post('/games', validationsToCreate, games.createOne)

export default routes
