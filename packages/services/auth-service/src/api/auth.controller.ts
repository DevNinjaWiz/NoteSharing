import { Request, Response } from 'express';
import { FirebaseUserRepository } from '../infrastructure';
import { RegisterUserUseCase, LoginUserUseCase } from '../service';

const userRepository = new FirebaseUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await registerUserUseCase.execute({ email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserUseCase.execute({ email, password });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
