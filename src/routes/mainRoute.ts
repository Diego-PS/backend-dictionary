import { MainRouteController } from 'controllers'
import { Router } from 'express'

export const mainRoute = Router()

const mainRouteController = new MainRouteController()

mainRoute.get('/', mainRouteController.sendMessage)
