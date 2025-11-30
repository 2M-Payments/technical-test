import { injectable, inject } from "tsyringe";
import { UserRepository } from "@/repositories/user.repository";
import { RegisterUserInput, LoginInput } from "@/schemas/auth.schema";
import { hashPassword, comparePassword } from "@/utils/password-hash.util";
import { generateAccessToken } from "@/utils/jwt.util";
import { AppError } from "@/errors/app-error";

@injectable()
export class AuthService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  async register(data: RegisterUserInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("E-mail já em uso", 409);
    }

    const passwordHash = await hashPassword(data.password);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHash,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: generateAccessToken(user.id),
    };
  }

  async login(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: generateAccessToken(user.id),
    };
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
