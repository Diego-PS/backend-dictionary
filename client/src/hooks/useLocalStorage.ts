import { LocalStorageKey } from 'enums'

export const useLocalStorage = () => {
  const set = (key: LocalStorageKey, value: string) => {
    localStorage.setItem(key, value)
  }

  const get = (key: LocalStorageKey) => localStorage.getItem(key)

  const storage = {
    set,
    get,
  }

  return { storage }
}
