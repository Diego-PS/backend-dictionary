import { Router } from 'express'
import { UserRepository } from 'repositories'
import { UserController } from 'controllers'
import { GetFavorites, GetHistory, GetUserProfile } from 'use-cases'
import { asyncHandler, Cache } from 'utils'
import { authenticate } from 'middlewares'

export const userRoutes = Router()

const userRepository = new UserRepository()

const getUserProfileUseCase = new GetUserProfile(userRepository)
const getHistoryUseCase = new GetHistory(userRepository)
const getFavoritesUseCase = new GetFavorites(userRepository)

const cache = new Cache()
const userController = new UserController(
  getUserProfileUseCase,
  getHistoryUseCase,
  getFavoritesUseCase,
  cache
)

userRoutes.get('/me', authenticate, asyncHandler(userController.getUserProfile))
userRoutes.get(
  '/me/history',
  authenticate,
  asyncHandler(userController.getHistory)
)
userRoutes.get(
  '/me/favorites',
  authenticate,
  asyncHandler(userController.getFavorites)
)
