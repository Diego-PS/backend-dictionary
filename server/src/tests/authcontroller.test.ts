// Imports e configuração inicial

import { AuthController } from '../controllers'

import { Signin, Signup } from '../usecases'

import { Response } from 'express'

import {
  signupUseCaseMock,
  signinUseCaseMock,
  mockRequest,
  mockResponse,
} from './testSetup'

describe('AuthController', () => {
  const authController = new AuthController(
    signupUseCaseMock as Signup,
    signinUseCaseMock as Signin
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Signup Tests
  it('deve realizar signup com sucesso', async () => {
    ;(signupUseCaseMock.execute as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'John',
      token: 'abc',
    })

    const req = mockRequest({
      name: 'John',
      email: 'john@example.com',
      password: '1234',
    })
    const res = mockResponse()

    await authController.signup(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({
      id: '1',
      name: 'John',
      token: 'abc',
    })
  })

  it('deve lançar erro no signup com email duplicado', async () => {
    ;(signupUseCaseMock.execute as jest.Mock).mockRejectedValue(
      new Error('Email already exists')
    )

    const req = mockRequest({
      name: 'John',
      email: 'duplicate@example.com',
      password: '1234',
    })
    const res = mockResponse()

    await expect(
      authController.signup(req as any, res as Response)
    ).rejects.toThrow('Email already exists')
  })

  it('deve lançar erro ao tentar signup com dados inválidos', async () => {
    // Adjust mock to simulate invalid input error
    ;(signupUseCaseMock.execute as jest.Mock).mockRejectedValue(
      new Error('Invalid input data')
    )

    const req = mockRequest({ name: '', email: 'invalidemail', password: '' })
    const res = mockResponse()

    await expect(
      authController.signup(req as any, res as Response)
    ).rejects.toThrow('Invalid input data')
  })

  it('deve lançar erro genérico ao falhar no signup', async () => {
    ;(signupUseCaseMock.execute as jest.Mock).mockRejectedValue(
      new Error('Unexpected error')
    )

    const req = mockRequest({
      name: 'John',
      email: 'john@example.com',
      password: '1234',
    })
    const res = mockResponse()

    await expect(
      authController.signup(req as any, res as Response)
    ).rejects.toThrow('Unexpected error')
  })

  // Signin Tests
  it('deve realizar signin com sucesso', async () => {
    ;(signinUseCaseMock.execute as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'John',
      token: 'abc',
    })

    const req = mockRequest({ email: 'john@example.com', password: '1234' })
    const res = mockResponse()

    await authController.signin(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({
      id: '1',
      name: 'John',
      token: 'abc',
    })
  })

  it('deve lançar erro ao tentar signin com credenciais inválidas', async () => {
    ;(signinUseCaseMock.execute as jest.Mock).mockRejectedValue(
      new Error('Incomplete input data')
    )

    const req = mockRequest({
      email: 'john@example.com',
      password: 'wrongpassword',
    })
    const res = mockResponse()

    await expect(
      authController.signin(req as any, res as Response)
    ).rejects.toThrow('Incomplete input data')
  })

  it('deve lançar erro ao tentar signin com dados incompletos', async () => {
    // Adjust mock to simulate incomplete input data error
    const req = mockRequest({ email: '', password: '' })
    const res = mockResponse()

    await expect(
      authController.signin(req as any, res as Response)
    ).rejects.toThrow('Incomplete input data')
  })

  it('deve lançar erro genérico ao falhar no signin', async () => {
    ;(signinUseCaseMock.execute as jest.Mock).mockRejectedValue(
      new Error('Unexpected error')
    )

    const req = mockRequest({ email: 'john@example.com', password: '1234' })
    const res = mockResponse()

    await expect(
      authController.signin(req as any, res as Response)
    ).rejects.toThrow('Unexpected error')
  })
})
