import {
  HasherInterface,
  JsonWebTokenInterface,
  UserRepositoryInterface,
} from 'interfaces'

export class Signin {
  constructor(
    private userRepository: UserRepositoryInterface,
    private hasher: HasherInterface,
    private jwt: JsonWebTokenInterface
  ) {}

  execute = async (
    email: string,
    password: string
  ): Promise<{ id: string; name: string; token: string }> => {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isPasswordValid = await this.hasher.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    const token = this.jwt.generate(user.id)
    return { id: user.id, name: user.name, token }
  }
}
