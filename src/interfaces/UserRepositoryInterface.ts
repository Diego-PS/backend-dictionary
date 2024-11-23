import { User, Word } from 'entities'

export interface UserRepositoryInterface {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  checkIfUserHasWordInHistory(id: string, word: string): Promise<boolean>
  registerWordToHistory(id: string, word: string): Promise<Word> 
  create(userInfo: Omit<User, 'id'>): Promise<User>
}
