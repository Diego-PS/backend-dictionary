import { UserRepositoryInterface } from 'interfaces'

export class GetUserProfile {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(
    id: string
  ): Promise<{ id: string; name: string; email: string }> {
    const user = await this.userRepository.findById(id)
    if (user === null)
      throw new Error(`Id ${id} does not correspond to any user`)
    return { id: user.id, name: user.name, email: user.email }
  }
}
