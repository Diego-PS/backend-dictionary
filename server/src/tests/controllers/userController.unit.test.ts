// Imports e configuração inicial

import { UserController } from '../../controllers'
import { mockRequest, mockResponse } from '../testSetup'
import { Response } from 'express'
import {
  GetUserProfile,
  GetHistory,
  GetFavorites,
} from '../../usecases'
import { CacheInterface } from 'interfaces'

describe('UserController', () => {
  const getUserProfileUseCaseMock: Partial<GetUserProfile> = { execute: jest.fn() }
  const getHistoryUseCaseMock: Partial<GetHistory> = { execute: jest.fn() }
  const getFavoritesUseCaseMock: Partial<GetFavorites> = { execute: jest.fn() }
  const cacheMock: Partial<CacheInterface> = { execute: jest.fn() }

  const userController = new UserController(
    getUserProfileUseCaseMock as GetUserProfile,
    getHistoryUseCaseMock as GetHistory,
    getFavoritesUseCaseMock as GetFavorites,
    cacheMock as CacheInterface
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // getUserProfile Tests
  it('deve retornar o perfil do usuário com sucesso', async () => {
    ;(cacheMock.execute as jest.Mock).mockResolvedValue({
      value: { id: '1', name: 'John Doe', email: 'john@example.com' },
      metadata: { cache: 'HIT', responseTime: '5ms' },
    })

    const req = mockRequest({}, { id: '1' })
    const res = mockResponse()

    await userController.getUserProfile(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.set).toHaveBeenCalledWith({
      'x-cache': 'HIT',
      'x-response-time': '5ms',
    })
    expect(res.send).toHaveBeenCalledWith({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    })
  })

  it('deve lançar erro ao falhar em obter o perfil do usuário', async () => {
    ;(cacheMock.execute as jest.Mock).mockRejectedValue(new Error('User not found'))

    const req = mockRequest({}, { id: '1' })
    const res = mockResponse()

    await expect(userController.getUserProfile(req as any, res as Response)).rejects.toThrow('User not found')
  })

  // getHistory Tests
  it('deve retornar o histórico com sucesso', async () => {
    ;(getHistoryUseCaseMock.execute as jest.Mock).mockResolvedValue({ history: [] })

    const req = mockRequest({}, { id: '1' }, { page: '1', limit: '10' })
    const res = mockResponse()

    await userController.getHistory(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ history: [] })
  })
  
  it('retorna erro por página negativa', async () => {
    const req = mockRequest({}, { id: '1' }, { page: '-1', limit: '10' });
    const res = mockResponse();
  
    // Mock execute to avoid bypassing internal validation
    (getHistoryUseCaseMock.execute as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid query argument(s)');
    });
  
    await expect(userController.getHistory(req as any, res as Response))
      .rejects.toThrow('Invalid query argument(s)');
  });
  

  it('deve lançar erro ao fornecer página inválida em getHistory', async () => {
    const req = mockRequest({}, { id: '1' }, { page: '-1', limit: '10' })
    const res = mockResponse()

    await expect(userController.getHistory(req as any, res as Response)).rejects.toThrow('Invalid query argument(s)')
  })

  it('deve lançar erro ao falhar em buscar o histórico', async () => {
    ;(getHistoryUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('History fetch failed'))

    const req = mockRequest({}, { id: '1' }, { page: '1', limit: '10' })
    const res = mockResponse()

    await expect(userController.getHistory(req as any, res as Response)).rejects.toThrow('History fetch failed')
  })

  // getFavorites Tests
  it('deve retornar favoritos com sucesso', async () => {
    ;(getFavoritesUseCaseMock.execute as jest.Mock).mockResolvedValue({ favorites: [] })

    const req = mockRequest({}, { id: '1' }, { page: '1', limit: '10' })
    const res = mockResponse()

    await userController.getFavorites(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ favorites: [] })
  })

  it('deve lançar erro ao fornecer limite inválido em getFavorites', async () => {
    const req = mockRequest({}, { id: '1' }, { page: '1', limit: '-5' })
    const res = mockResponse()

    await expect(userController.getFavorites(req as any, res as Response)).rejects.toThrow('Invalid query argument(s)')
  })

  it('deve lançar erro ao falhar em buscar favoritos', async () => {
    ;(getFavoritesUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Favorites fetch failed'))

    const req = mockRequest({}, { id: '1' }, { page: '1', limit: '10' })
    const res = mockResponse()

    await expect(userController.getFavorites(req as any, res as Response)).rejects.toThrow('Favorites fetch failed')
  })
})
