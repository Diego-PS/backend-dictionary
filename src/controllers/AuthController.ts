import { Request, Response } from 'express'
import { Signup } from 'use-cases'

type SignupRequest = Request<
  unknown,
  unknown,
  {
    name: string
    email: string
    password: string
  }
>

type SignupResponse = Response<{
  id: string
  name: string
  token: string
}>

export class AuthController {
  constructor(private signupUseCase: Signup) {}

  signup = async ({ body }: SignupRequest, res: SignupResponse) => {
    const { name, email, password } = body
    const signupData = await this.signupUseCase.execute(name, email, password)
    res.status(200).send(signupData)
  }
}
