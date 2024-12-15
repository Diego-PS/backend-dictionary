import { Signup } from '../usecases'
import {
  HasherInterface,
  JsonWebTokenInterface,
  UserRepositoryInterface,
} from 'interfaces'

describe('Caso de Uso: Cadastro (Signup)', () => {
  let signup: Signup
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

    signup = new Signup(userRepositoryMock, hasherMock, jwtMock)
  })

  it('deve cadastrar um usuário com sucesso e retornar os dados do usuário com um token', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null)
    userRepositoryMock.create.mockResolvedValue({
      id: '1',
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    })
    hasherMock.hash.mockResolvedValue('hashedpassword')
    jwtMock.generate.mockReturnValue('generated_token')

    const result = await signup.execute(
      'John',
      'john@example.com',
      'password123'
    )

    expect(result).toEqual({ id: '1', name: 'John', token: 'generated_token' })
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'john@example.com'
    )
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    })
    expect(hasherMock.hash).toHaveBeenCalledWith('password123')
    expect(jwtMock.generate).toHaveBeenCalledWith('1')
  })

  it('deve lançar um erro se o email for inválido', async () => {
    await expect(
      signup.execute('John', 'invalid-email', 'password123')
    ).rejects.toThrow('A valid email is required to signup')
  })

  it('deve lançar um erro se a senha estiver vazia', async () => {
    await expect(
      signup.execute('John', 'john@example.com', '')
    ).rejects.toThrow('A password is required to signup')
  })

  it('deve lançar um erro se um usuário com o email fornecido já existir', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue({
      id: '2',
      name: 'Existing User',
      email: 'john@example.com',
      password: 'hashedpassword',
    })

    await expect(
      signup.execute('John', 'john@example.com', 'password123')
    ).rejects.toThrow('User with email john@example.com is already registered')
  })

  it('deve lançar um erro se o repositório de usuários falhar ao criar um usuário', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null)
    hasherMock.hash.mockResolvedValue('hashedpassword')
    userRepositoryMock.create.mockRejectedValue(new Error('Database error'))

    await expect(
      signup.execute('John', 'john@example.com', 'password123')
    ).rejects.toThrow('Database error')
  })
})

// Testes para Login (Signin)
