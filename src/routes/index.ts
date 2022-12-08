import express from 'express'
import routerCategories from './categories.routes.js'
import routerCustomers from './customers.routes.js'
import routerGames from './games.routes.js'
import routerRentals from './rentals.routes.js'

const routes = express.Router()

routes
  .use(routerCategories)
  .use(routerGames)
  .use(routerCustomers)
  .use(routerRentals)

export default routes
