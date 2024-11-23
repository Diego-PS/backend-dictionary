import { User, Word, PaginationQuery } from 'entities'

export interface UserRepositoryInterface {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  checkIfUserHasWordInHistory(id: string, word: string): Promise<boolean>
  registerWordToHistory(id: string, word: string): Promise<Word>
  checkIfWordIsInFavorites(id: string, word: string): Promise<boolean>
  addWordToFavorites(id: string, word: string): Promise<Word>
  removeWordFromFavorites(id: string, word: string): Promise<Word>
  getHistory(
    id: string,
    pagination: PaginationQuery
  ): Promise<{ words: Word[]; totalWords: number }>
  getFavorites(
    is: string,
    pagination: PaginationQuery
  ): Promise<{ words: Word[]; totalWords: number }>
  create(userInfo: Omit<User, 'id'>): Promise<User>
}
