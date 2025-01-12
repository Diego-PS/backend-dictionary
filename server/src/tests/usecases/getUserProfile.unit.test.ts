import { GetUserProfile } from '../../usecases'

import { UserRepositoryInterface } from 'interfaces'

describe('Caso de Uso: GetProfile', () => {
  let userRepositoryMock: jest.Mocked<UserRepositoryInterface>
  let getUserProfile: GetUserProfile

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
    getUserProfile = new GetUserProfile(userRepositoryMock)
  })

  it('deve retornar o perfil do usuário quando ele existir', async () => {
    // Mock do método findById com um objeto User completo, incluindo a senha
    userRepositoryMock.findById.mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password', // Mock da propriedade de senha conforme necessário
    })

    const response = await getUserProfile.execute('1')

    expect(response).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    })

    expect(userRepositoryMock.findById).toHaveBeenCalledWith('1')
  })

  it('deve lançar um erro se o usuário não existir', async () => {
    userRepositoryMock.findById.mockResolvedValue(null)

    await expect(getUserProfile.execute('999')).rejects.toThrow(
      'Id 999 does not correspond to any user'
    )

    expect(userRepositoryMock.findById).toHaveBeenCalledWith('999')
  })
})

// Testes para Obter Favoritos
