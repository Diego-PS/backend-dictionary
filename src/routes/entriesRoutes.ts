import { Router } from 'express'
import { WordRepository } from 'repositories'
import { GetEntries } from 'use-cases'
import { asyncHandler, Cache } from 'utils'
import { EntriesController } from 'src/controllers/EntriesController'

export const entriesRoutes = Router()

const wordRepository = new WordRepository()

const getEntriesUseCase = new GetEntries(wordRepository)
const cache = new Cache()
const entriesController = new EntriesController(getEntriesUseCase, cache)

entriesRoutes.get('/en', asyncHandler(entriesController.getEntries))
