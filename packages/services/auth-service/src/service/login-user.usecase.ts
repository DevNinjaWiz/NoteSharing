import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../domain';
import { IUserRepository } from '../repository';

export class LoginUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user: IUser): Promise<{ user: IUser; token: string }> {
    const existingUser = await this.userRepository.findByEmail(user.email);

    if (!existingUser) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    const { password, ...userWithoutPassword } = existingUser;

    return { user: userWithoutPassword, token };
  }
}
