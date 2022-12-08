import express from 'express'
import routerCategories from './categories.routes.js'

const routes = express.Router()

routes.use(routerCategories)

export default routes
