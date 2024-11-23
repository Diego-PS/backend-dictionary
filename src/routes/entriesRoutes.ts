import { EntriesController } from 'controllers'
import { Router } from 'express'
import { authenticate } from 'middlewares'
import { UserRepository, WordRepository } from 'repositories'
import { GetEntries, ViewEntry } from 'use-cases'
import { asyncHandler, Cache } from 'utils'

export const entriesRoutes = Router()

const userRepository = new UserRepository()
const wordRepository = new WordRepository()

const getEntriesUseCase = new GetEntries(wordRepository)
const viewEntryUseCase = new ViewEntry(userRepository, wordRepository)
const cache = new Cache()
const entriesController = new EntriesController(getEntriesUseCase, viewEntryUseCase, cache)

entriesRoutes.get('/en', asyncHandler(entriesController.getEntries))
entriesRoutes.get('/en/:word', authenticate, asyncHandler(entriesController.viewEntry))