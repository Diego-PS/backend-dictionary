// Imports e configuração inicial

import { MainRouteController } from '../../controllers'
import { mockRequest, mockResponse } from '../testSetup'
import { Response } from 'express'

describe('MainRouteController', () => {
  const mainRouteController = new MainRouteController()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve retornar a mensagem de boas-vindas com sucesso', async () => {
    const req = mockRequest({})
    const res = mockResponse()

    await mainRouteController.sendMessage(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({
      message: 'Fullstack Challenge 🏅 - Dictionary'
    })
  })

  it('deve garantir que o status 200 foi retornado', async () => {
    const req = mockRequest({})
    const res = mockResponse()

    await mainRouteController.sendMessage(req as any, res as Response)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('deve garantir que a resposta contém a chave "message"', async () => {
    const req = mockRequest({})
    const res = mockResponse()

    await mainRouteController.sendMessage(req as any, res as Response)

    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    )
  })
})
