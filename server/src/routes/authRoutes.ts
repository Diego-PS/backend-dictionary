import { Router } from 'express'
import { UserRepository } from 'repositories'
import { AuthController } from 'controllers'
import { Signin, Signup } from 'use-cases'
import { asyncHandler, Hasher, JsonWebToken } from 'utils'

export const authRoutes = Router()

const userRepository = new UserRepository()
const haser = new Hasher()
const jwt = new JsonWebToken()

const signupUseCase = new Signup(userRepository, haser, jwt)
const signinUseCase = new Signin(userRepository, haser, jwt)
const authController = new AuthController(signupUseCase, signinUseCase)

authRoutes.post('/signup', asyncHandler(authController.signup))
authRoutes.post('/signin', asyncHandler(authController.signin))
