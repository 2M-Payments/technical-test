import { hashPassword, comparePassword } from "@/utils/password-hash.util";

describe("password-hash.util", () => {
  it("deve gerar hash da senha", async () => {
    const hash = await hashPassword("12345678");

    expect(hash).toBeDefined();
    expect(hash).not.toBe("12345678");
  });

  it("deve retornar true para senha correta", async () => {
    const hash = await hashPassword("12345678");
    const result = await comparePassword("12345678", hash);

    expect(result).toBe(true);
  });

  it("deve retornar false para senha incorreta", async () => {
    const hash = await hashPassword("12345678");
    const result = await comparePassword("senhaerrada", hash);

    expect(result).toBe(false);
  });
});

