import * as bcrypt from 'bcrypt';
import { IUser } from '../domain';
import { IUserRepository } from '../repository';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user: IUser): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(user.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser: IUser = {
      email: user.email,
      password: hashedPassword,
    };

    return this.userRepository.save(newUser);
  }
}
