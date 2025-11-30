import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "E-mail inválido" }),
  password: z.string().min(6, "Senha deve ter no mínimo 8 caracteres"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(120, "Nome deve ter no máximo 120 caracteres"),
    email: z.email({ message: "E-mail inválido" }),
    password: z.string().min(6, "Senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
