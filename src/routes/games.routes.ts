import express from 'express'
import * as games from '../api/controllers/games.controller.js'
import * as middle from '../api/middlewares/games.middlewares.js'

const routes = express.Router()

routes.get('/games', games.viewAll)

routes.post('/games', middle.validateGameSchema, games.createOne)

export default routes
