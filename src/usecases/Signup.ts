import { User } from 'entities'
import { HasherInterface, UserRepositoryInterface } from 'interfaces'

export class Signup {
  constructor(
    private userRepository: UserRepositoryInterface,
    private hasher: HasherInterface
  ) {}

  private checkIfPasswordIsValid(password: string) {
    // Throws an exception if password is invalid
    // Since no rule for password was specified,
    // any nonempty password will be considered valid
    if (password === '') {
      throw new Error('A password is required to sign-up')
    }
  }

  private checkIfEmailIsValid(email: string) {
    // Throws an expection if email is invalid
    // Checks if email has formatting of an actual email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      throw new Error('A valid email is required to sign-up')
    }
  }

  async execute(name: string, email: string, password: string): Promise<User> {
    this.checkIfEmailIsValid(email)
    this.checkIfPasswordIsValid(password)
    const hashedPassword = await this.hasher.hash(password)
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    })
    return user
  }
}
