import { EntriesController } from 'controllers'
import { Router } from 'express'
import { authenticate } from 'middlewares'
import { UserRepository, WordRepository } from 'repositories'
import {
  AddWordToFavorites,
  GetEntries,
  removeWordFromFavorites,
  ViewEntry,
} from 'use-cases'
import { asyncHandler, Cache } from 'utils'

export const entriesRoutes = Router()

const userRepository = new UserRepository()
const wordRepository = new WordRepository()

const getEntriesUseCase = new GetEntries(wordRepository)
const viewEntryUseCase = new ViewEntry(userRepository, wordRepository)
const addWordToFavoritesUseCase = new AddWordToFavorites(
  userRepository,
  wordRepository
)
const removeWordFromFavoritesUseCase = new removeWordFromFavorites(
  userRepository,
  wordRepository
)
const cache = new Cache()
const entriesController = new EntriesController(
  getEntriesUseCase,
  viewEntryUseCase,
  addWordToFavoritesUseCase,
  removeWordFromFavoritesUseCase,
  cache
)

entriesRoutes.get('/en', asyncHandler(entriesController.getEntries))
entriesRoutes.get(
  '/en/:word',
  authenticate,
  asyncHandler(entriesController.viewEntry)
)
entriesRoutes.post(
  '/en/:word/favorite',
  authenticate,
  asyncHandler(entriesController.addWordToFavorites)
)
entriesRoutes.delete(
  '/en/:word/unfavorite',
  authenticate,
  asyncHandler(entriesController.removeWordFromFavorites)
)
