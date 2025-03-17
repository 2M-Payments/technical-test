import { z } from "zod";

export const MusicoSchema = z.object({
  nome: z.string().min(3).max(255),
  telefone: z.string().min(10).max(20),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Formato YYYY-MM-DD
  instrumentoPrincipal: z.string().min(3).max(255),
  instrumentosSecundarios: z.array(z.string()).optional(),
});