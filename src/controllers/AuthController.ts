import { Request, Response } from 'express'
import { Signin, Signup } from 'use-cases'

type SignupRequest = Request<
  {},
  {},
  {
    name: string
    email: string
    password: string
  }
>

type SigninRequest = Request<
  {},
  {},
  {
    email: string
    password: string
  }
>

type AuthResponse = Response<{
  id: string
  name: string
  token: string
}>

export class AuthController {
  constructor(
    private signupUseCase: Signup,
    private signinUseCase: Signin
  ) {}

  signup = async ({ body }: SignupRequest, res: AuthResponse) => {
    const { name, email, password } = body
    const authData = await this.signupUseCase.execute(name, email, password)
    res.status(200).send(authData)
  }

  signin = async ({ body }: SigninRequest, res: AuthResponse) => {
    const { email, password } = body
    const authData = await this.signinUseCase.execute(email, password)
    res.status(200).send(authData)
  }
}
