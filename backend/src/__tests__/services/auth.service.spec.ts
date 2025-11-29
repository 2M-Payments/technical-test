import "reflect-metadata";
import { AuthService } from "@/services/auth.service";
import { UserRepository } from "@/repositories/user.repository";
import { AppError } from "@/errors/app-error";
import { RegisterUserInput, LoginInput } from "@/schemas/auth.schema";
import { hashPassword, comparePassword } from "@/utils/password-hash.util";
import { generateAccessToken } from "@/utils/jwt.util";
import { User } from "@/entities/user.entity";

jest.mock("@/utils/password-hash.util");
jest.mock("@/utils/jwt.util");

const hashPasswordMock = hashPassword as jest.MockedFunction<typeof hashPassword>;
const comparePasswordMock = comparePassword as jest.MockedFunction<typeof comparePassword>;
const generateAccessTokenMock = generateAccessToken as jest.MockedFunction<typeof generateAccessToken>;

describe("AuthService", () => {
  const makeRepositoryMock = () => {
    const repository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    return {
      repository,
      instance: repository as Partial<UserRepository> as UserRepository,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve registrar um novo usuário", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new AuthService(instance);

    const payload: RegisterUserInput = {
      name: "Daniel Felizardo",
      email: "daniel@email.com",
      password: "strongpass",
    };

    repository.findByEmail.mockResolvedValue(null);
    hashPasswordMock.mockResolvedValue("hashed");
    repository.create.mockResolvedValue({
      id: "1",
      name: payload.name,
      email: payload.email,
      password: "hashed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    generateAccessTokenMock.mockReturnValue("token");

    const result = await service.register(payload);

    expect(repository.findByEmail).toHaveBeenCalledWith(payload.email);
    expect(hashPasswordMock).toHaveBeenCalledWith(payload.password);
    expect(repository.create).toHaveBeenCalledWith({
      name: payload.name,
      email: payload.email,
      password: "hashed",
    });
    expect(generateAccessTokenMock).toHaveBeenCalledWith("1");
    expect(result).toEqual({
      user: {
        id: "1",
        name: payload.name,
        email: payload.email,
      },
      token: "token",
    });
  });

  it("não deve registrar emails duplicados", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new AuthService(instance);

    repository.findByEmail.mockResolvedValue({} as User);

    await expect(
      service.register({ name: "Qualquer", email: "test@example.com", password: "12345678" }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("deve fazer login com credenciais válidas", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new AuthService(instance);

    const payload: LoginInput = {
      email: "ana@email.com",
      password: "strongpass",
    };

    repository.findByEmail.mockResolvedValue({
      id: "1",
      name: "Daniel Felizardo",
      email: payload.email,
      password: "hashed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    comparePasswordMock.mockResolvedValue(true);
    generateAccessTokenMock.mockReturnValue("token");

    const result = await service.login(payload);

    expect(repository.findByEmail).toHaveBeenCalledWith(payload.email);
    expect(comparePasswordMock).toHaveBeenCalledWith(payload.password, "hashed");
    expect(result).toEqual({
      user: {
        id: "1",
        name: "Daniel Felizardo",
        email: payload.email,
      },
      token: "token",
    });
  });

  it("deve lançar erro quando usuário não for encontrado no login", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new AuthService(instance);

    repository.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: "missing@example.com", password: "12345678" }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("deve lançar erro quando a senha não corresponder", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new AuthService(instance);

    repository.findByEmail.mockResolvedValue({
      id: "1",
      name: "Daniel Felizardo",
      email: "daniel@email.com",
      password: "hashed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    comparePasswordMock.mockResolvedValue(false);

    await expect(
      service.login({ email: "daniel@email.com", password: "errada" }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
