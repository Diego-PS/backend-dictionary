import { User } from 'entities'

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>
  create(user: Omit<User, 'id'>): Promise<User>
}
