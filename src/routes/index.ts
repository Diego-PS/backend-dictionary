import { Router } from 'express'
import { mainRoute } from './mainRoute'
import { authRoutes } from './authRoutes'
import { userRoutes } from './userRoutes'

export const router = Router()

router.use('/', mainRoute)
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
