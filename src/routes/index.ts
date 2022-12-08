import express from 'express'
import routerCategories from './categories.routes.js'
import routerCustomers from './customers.routes.js'
import routerGames from './games.routes.js'

const routes = express.Router()

routes.use(routerCategories).use(routerGames).use(routerCustomers)

export default routes
