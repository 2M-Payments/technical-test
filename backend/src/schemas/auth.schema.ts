import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3).max(120),
  email: z.email(),
  password: z.string().min(8),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;