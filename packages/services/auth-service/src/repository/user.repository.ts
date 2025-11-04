import { IUser } from '../domain';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  save(user: IUser): Promise<IUser>;
}
