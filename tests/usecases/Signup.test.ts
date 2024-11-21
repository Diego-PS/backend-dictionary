/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'entities'
import { UserRepository } from 'repositories'
import { Signup } from 'use-cases'
import { Hasher, JsonWebToken } from 'utils'
jest.mock('repositories')
jest.mock('utils')
describe('Signup', () => {
  it('should throw exception with empty password', async () => {
    const userRepository = new UserRepository()
    const haser = new Hasher()
    const jwt = new JsonWebToken(
      '8c72e5969d1acd2567ef1c84eafb554c4cdcf39a06dbc2fd3eea675719505239'
    )
    const signup = new Signup(userRepository, haser, jwt)
    await expect(async () => {
      await signup.execute('Name', 'email@email.com', '')
    }).rejects.toThrow(new Error('A password is required to signup'))
  })

  it.each<string>([
    'teste@teste@teste.com',
    'invalid-email@test',
    '@email',
    'email',
  ])('should throw exception with invalid email', async (email) => {
    const userRepository = new UserRepository()
    const haser = new Hasher()
    const jwt = new JsonWebToken(
      '8c72e5969d1acd2567ef1c84eafb554c4cdcf39a06dbc2fd3eea675719505239'
    )
    const signup = new Signup(userRepository, haser, jwt)
    await expect(async () => {
      await signup.execute('Name', email, 'password')
    }).rejects.toThrow(new Error('A valid email is required to signup'))
  })

  it('should work', async () => {
    jest.mocked(UserRepository).mockImplementation(() => {
      return {
        findByEmail: async (email: string) => null,
        create: async (userInfo: Omit<User, 'id'>) => ({
          id: 'id',
          ...userInfo,
        }),
      }
    })
    const userRepository = new UserRepository()
    const haser = new Hasher()
    const jwt = new JsonWebToken(
      '8c72e5969d1acd2567ef1c84eafb554c4cdcf39a06dbc2fd3eea675719505239'
    )
    const signup = new Signup(userRepository, haser, jwt)
    const user = await signup.execute('Name', 'email@email.com', 'password')
    expect(user.name).toBe('Name')
  })
})
