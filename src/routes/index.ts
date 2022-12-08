import express from 'express'
import routerCategories from './categories.routes.js'
import routerGames from './games.routes.js'

const routes = express.Router()

routes.use(routerCategories).use(routerGames)

export default routes
