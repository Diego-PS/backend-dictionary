import { Router } from 'express'
import { mainRoute } from './mainRoute'
import { authRoutes } from './authRoutes'

export const router = Router()

router.use('/', mainRoute)
router.use('/auth', authRoutes)
