import { getHistory } from './getHistory'
import { signin } from './signin'
import { signup } from './signup'

export const api = {
  signup,
  signin,
  getHistory,
}

export * from './signup'
export * from './signin'
