import { Router } from 'express'
import { UserRepository } from 'repositories'
import { AuthController } from 'src/controllers/AuthController'
import { Signup } from 'use-cases'
import { asyncHandler, Hasher, JsonWebToken } from 'utils'

export const authRoutes = Router()

const userRepository = new UserRepository()
const haser = new Hasher()
const jwt = new JsonWebToken(
  '8c72e5969d1acd2567ef1c84eafb554c4cdcf39a06dbc2fd3eea675719505239'
)

const signupUseCase = new Signup(userRepository, haser, jwt)
const authController = new AuthController(signupUseCase)

authRoutes.post('/signup', asyncHandler(authController.signup))
