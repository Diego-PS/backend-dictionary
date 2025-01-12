import { Signin } from '../../usecases'

import {
  HasherInterface,
  JsonWebTokenInterface,
  UserRepositoryInterface,
} from 'interfaces'

describe('Caso de Uso: Login (Signin)', () => {
  let signin: Signin
  let userRepositoryMock: jest.Mocked<UserRepositoryInterface>
  let hasherMock: jest.Mocked<HasherInterface>
  let jwtMock: jest.Mocked<JsonWebTokenInterface>

  beforeEach(() => {
    // Mock do UserRepositoryInterface
    userRepositoryMock = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      checkIfUserHasWordInHistory: jest.fn(),
      registerWordToHistory: jest.fn(),
      checkIfWordIsInFavorites: jest.fn(),
      addWordToFavorites: jest.fn(),
      removeWordFromFavorites: jest.fn(),
      getHistory: jest.fn(),
      getFavorites: jest.fn(),
      create: jest.fn(),
    }

    // Mock do HasherInterface
    hasherMock = {
      hash: jest.fn(),
      compare: jest.fn(),
    }

    // Mock do JsonWebTokenInterface
    jwtMock = {
      generate: jest.fn(),
      verify: jest.fn(),
    }

    signin = new Signin(userRepositoryMock, hasherMock, jwtMock)
  })

  it('deve realizar login com sucesso e retornar os dados do usuário com um token', async () => {
    const mockUser = {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    }

    userRepositoryMock.findByEmail.mockResolvedValue(mockUser)
    hasherMock.compare.mockResolvedValue(true)
    jwtMock.generate.mockReturnValue('generated_token')

    const result = await signin.execute('john@example.com', 'password123')

    expect(result).toEqual({ id: '1', name: 'John', token: 'generated_token' })
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'john@example.com'
    )
    expect(hasherMock.compare).toHaveBeenCalledWith(
      'password123',
      'hashedpassword'
    )
    expect(jwtMock.generate).toHaveBeenCalledWith('1')
  })

  it('deve lançar um erro se o email não existir', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null)

    await expect(
      signin.execute('nonexistent@example.com', 'password123')
    ).rejects.toThrow('Invalid email or password')
  })

  it('deve lançar um erro se a senha não corresponder', async () => {
    const mockUser = {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    }

    userRepositoryMock.findByEmail.mockResolvedValue(mockUser)
    hasherMock.compare.mockResolvedValue(false) // Mock da comparação de senha como falso

    await expect(
      signin.execute('john@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid email or password')

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'john@example.com'
    )
    expect(hasherMock.compare).toHaveBeenCalledWith(
      'wrongpassword',
      'hashedpassword'
    )
  })

  it('deve lançar um erro se o repositório de usuários falhar ao buscar o usuário', async () => {
    userRepositoryMock.findByEmail.mockRejectedValue(
      new Error('Database error')
    )

    await expect(
      signin.execute('john@example.com', 'password123')
    ).rejects.toThrow('Database error')
  })
})
