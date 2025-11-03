import { z } from "zod";

export const createRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Informe um título com pelo menos 3 caracteres."),
  description: z
    .string()
    .trim()
    .min(10, "Descreva a solicitação com mais detalhes."),
  category: z.enum(["ferias", "admissao", "desligamento", "beneficios", "outros"]),
  department: z.enum(["RH", "DP"]),
  priority: z.enum(["baixa", "media", "alta"])
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;