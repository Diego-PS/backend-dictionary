import { User } from 'entities'

export interface UserRepositoryInterface {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(userInfo: Omit<User, 'id'>): Promise<User>
}
