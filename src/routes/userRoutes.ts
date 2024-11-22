import { Router } from 'express'
import { UserRepository } from 'repositories'
import { UserController } from 'controllers'
import { GetUserProfile } from 'use-cases'
import { asyncHandler, Cache } from 'utils'
import { authenticate } from 'middlewares'

export const userRoutes = Router()

const userRepository = new UserRepository()

const getUserProfileUseCase = new GetUserProfile(userRepository)
const cache = new Cache()
const userController = new UserController(getUserProfileUseCase, cache)

userRoutes.get('/me', authenticate, asyncHandler(userController.getUserProfile))
