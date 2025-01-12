import { addWordToFavorites } from './addWordToFavorites'
import { getFavorites } from './getFavorites'
import { getHistory } from './getHistory'
import { getWords } from './getWords'
import { removeWordFromFavorites } from './removeWordFromFavorites'
import { signin } from './signin'
import { signup } from './signup'
import { viewWord } from './viewWord'

export const api = {
  signup,
  signin,
  getHistory,
  getWords,
  viewWord,
  addWordToFavorites,
  getFavorites,
  removeWordFromFavorites,
}

export * from './signup'
export * from './signin'
export * from './getHistory'
export * from './getWords'
export * from './viewWord'
export * from './addWordToFavorites'
export * from './getFavorites'
export * from './removeWordFromFavorites'
