import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(data: { email: string; userName: string; password: string }): Promise<Omit<User, "password">> {
    const existingUser = await this.userRepository.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Já existe um usuário com esse e-mail.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async authUser(data: { email: string; password: string }): Promise<{ user: Omit<User, "password">; token: string }> {
    const user = await this.userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new Error("Usuário inexistente ou senha incorreta.");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new Error("Usuário inexistente ou senha incorreta.");
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }
}
