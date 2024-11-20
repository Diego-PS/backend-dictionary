import { User } from 'entities'

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>
  create(userInfo: Omit<User, 'id'>): Promise<User>
}
