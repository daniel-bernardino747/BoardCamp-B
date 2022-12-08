import express from 'express'
import { getGames } from '../controllers/games.controller.js'

const routes = express.Router()

routes.get('/games', getGames)

export default routes
