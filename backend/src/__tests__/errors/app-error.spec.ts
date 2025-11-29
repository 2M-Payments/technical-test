import { AppError } from "@/errors/app-error";

describe("AppError", () => {
  it("deve criar erro com mensagem e statusCode padrão", () => {
    const error = new AppError("Erro genérico");

    expect(error.message).toBe("Erro genérico");
    expect(error.statusCode).toBe(400);
  });

  it("deve criar erro com statusCode customizado", () => {
    const error = new AppError("Não encontrado", 404);

    expect(error.message).toBe("Não encontrado");
    expect(error.statusCode).toBe(404);
  });

  it("deve ser instância de Error", () => {
    const error = new AppError("Teste");

    expect(error).toBeInstanceOf(Error);
  });
});

