import {
  HasherInterface,
  JsonWebTokenInterface,
  UserRepositoryInterface,
} from 'interfaces'

export class Signup {
  constructor(
    private userRepository: UserRepositoryInterface,
    private hasher: HasherInterface,
    private jwt: JsonWebTokenInterface
  ) {}

  private checkIfPasswordIsValid(password: string) {
    // Throws an exception if password is invalid
    // Since no rule for password was specified,
    // any nonempty password will be considered valid
    if (password === '') {
      throw new Error('A password is required to signup')
    }
  }

  private checkIfEmailIsValid(email: string) {
    // Throws an expection if email is invalid
    // Checks if email has formatting of an actual email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      throw new Error('A valid email is required to signup')
    }
  }

  execute = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ id: string; name: string; token: string }> => {
    this.checkIfEmailIsValid(email)
    this.checkIfPasswordIsValid(password)
    const hashedPassword = await this.hasher.hash(password)
    const foundUser = await this.userRepository.findByEmail(email)
    if (foundUser !== null) throw new Error(`User with email ${email} is already registered`)
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    })
    const token = this.jwt.generate(user.id)
    return { id: user.id, name: user.name, token }
  }
}
