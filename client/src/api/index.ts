import { addWordToFavorites } from './addWordToFavorites'
import { getHistory } from './getHistory'
import { getWords } from './getWords'
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
}

export * from './signup'
export * from './signin'
export * from './getHistory'
export * from './getWords'
export * from './viewWord'
export * from './addWordToFavorites'
